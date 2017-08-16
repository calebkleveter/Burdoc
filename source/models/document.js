const Sequelize = require('sequelize');
const database = require('../database');

/**
 * The model definition for Sequelize.
 */
const model = database.sequelize.define('document', {
  userID: {
    type: Sequelize.INTEGER
  },
  name: {
    type: Sequelize.STRING
  },
  contents: {
    type: Sequelize.TEXT
  }
});

/**
 * Creates a document table if one does not already exist.
 */
function sync () {
  model.sync({force: false})
    .then(function () {
      console.log('Synced document table');
    })
    .catch(function (error) {
      console.error('Failed to sync document table: ', error);
    });
}

/**
 * Finds the document in the database (if it exists) that has the matching name and user ID.
 * 
 * @param {string} name The name of the document.
 * @param {string} userID The ID of the user that owns the document.
 * @returns A promise that resolves with the document if it exists or  nil if it doesn't.
 */
function findByNameAndUserID (name, userID) {
  return model.findOne({
    where: {
      name: name,
      $and: {userID: userID}
    }
  });
}

/**
 * Creates a new document if one does not already exist with the name and user ID.
 * 
 * @param {string} userID The database ID of the user who owns the document.
 * @param {string} name The name of the document.
 * @param {string} contents The Markdown contained in the document.
 * @returns A promise that resolves if the document is successfully created.
 */
function create (userID, name, contents) {
  return new Promise(function (resolve, reject) {
    findByNameAndUserID(name, userID).then(function (document) {
      if (document == null) {
        model.create({
          userID: userID,
          name: name,
          contents: contents
        });
        resolve();
      } else {
        throw new Error('A document already exists with that name and user ID');
      }
    }).catch(function (error) {
      reject(error);
    });
  });
}

module.exports = {
  model: model,
  sync: sync,
  findByNameAndUserID: findByNameAndUserID,
  create: create
};
