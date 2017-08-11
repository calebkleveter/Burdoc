const Sequelize = require('sequelize');
const database = require('../database');
const argon2 = require('argon2');

/**
 * The user model for sequelize.
 */
const model = database.sequelize.define('user', {
  name: {
    type: Sequelize.STRING
  },
  email: {
    type: Sequelize.STRING
  },
  password: {
    type: Sequelize.STRING
  },
  documents: {
    type: Sequelize.ARRAY(Sequelize.STRING)
  }
});

/**
 * Syncs the user model with the tabel in the PostgreSQL database.
 */
function sync () {
  model.sync({force: false})
    .then(function () {
      console.log('Synced user table');
    })
    .catch(function (error) {
      console.error('Failed to sync user table: ', error);
    });
}

/**
 * Gets a user from the database based on their email.
 *
 * @param {string} email: The email of the user you want to fetch.
 * @return A promise that, if resolved, containes the user object fetched from the PostgreSQL database.
 */
function fetchByEmail (email) {
  return model.findOne({
    where: {
      email: email
    }
  });
}

/**
 * Gets a user from the database based on their username.
 *
 * @param {string} name: The username of the user you want to fetch.
 * @return A promise that, if resolved, containes the user object fetched from the PostgreSQL database.
 */
function fetchByName (name) {
  return model.findOne({
    where: {
      name: name
    }
  });
}

/**
 * Creates a new row in the user table in the PostgreSQL database.
 *
 * @param {string} username: The username of the user to be created.
 * @param {string} email: The email of the user to be created.
 * @param {string} password: The password of the user to be created. This string is hashed using the argon2 hashing algorithm.
 * @throws Any errors when hashing the password.
 */
function create (username, email, password) {
  argon2.hash(password)
    .then(function (hash) {
      model.create({
        name: username,
        email: email,
        password: hash,
        documents: []
      });
    })
    .catch(function (error) {
      throw error;
    });
}

/**
 * Checks an email or username against a password to see if they match.
 *
 * @param {string} name: The username or email of a user.
 * @param {string} password: A password to check against the name to see if it is the correct password.
 * @return A promise with that resolves with the user if the name and password match, or rejects with either an error in varifying/fetching the user or with 'password did not match'.
 */
function authenticate (name, password) {
  return new Promise(function (resolve, reject) {
    fetchByName(name).then(function (user) {
      argon2.verify(user.password, password)
        .then(function (didMatch) {
          if (didMatch) {
            resolve(user);
          } else {
            reject(new Error('Password did not match with the email/username.'));
          }
        })
        .catch(function (error) {
          reject(error);
        });
    }).catch(function (error) {
      reject(error);
    });
  });
}

/**
 * Adds a link to a document held in the ElasticSearch database to a users documents array.
 *
 * @param {string} link: The link to the document.
 * @param {string} name: The email or username of the user to add the link to.
 */
function addDocumentLinkToUser (link, name) {
  model.update(
    {documents: database.sequelize.fn('array_append', database.sequelize.col('documents'), link)},
    {where: {
      name: name,
      $or: [{email: name}]}
    }
  );
}

module.exports = {
  model: model,
  sync: sync,
  fetchByEmail: fetchByEmail,
  fetchByName: fetchByName,
  create: create,
  authenticate: authenticate,
  addDocumentLinkToUser: addDocumentLinkToUser
};
