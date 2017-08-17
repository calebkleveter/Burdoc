const Sequelize = require('sequelize');
const slug = require('slug');
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
  url: {
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
          url: slug(name),
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

/**
 * Updates the contents of a document based on it's user ID and name.
 * 
 * @param {string} contents The new contents for the document.
 * @param {string} name The name of the document to be updated.
 * @param {string} userID The ID of the user that owns the document.
 * @returns A promises that resolves if a document was updated.
 */
function updateContentsForNameAndUserID (contents, name, userID) {
  return new Promise(function (resolve, reject) {
    model.update(
      {contents: contents},
      {
        name: name,
        userID: userID
      }
    ).then(function (data) {
      if (data[0] === 0) {
        reject(new Error('There is no document for the user ID and name passed in.'));
      } else {
        resolve();
      }
    }).catch(function (error) {
      reject(error);
    });
  });
}

/**
 * Updates the name of a document based on it's user ID and name.
 * 
 * @param {string} newName The new name for the document.
 * @param {string} name The name of the document to be updated.
 * @param {string} userID The ID of the user that owns the document.
 * @returns A promises that resolves if a document was updated.
 */
function updateNameForNameAndUserID (newName, name, userID) {
  return new Promise(function (resolve, reject) {
    model.update(
      {
        name: newName,
        url: slug(newName)
      },
      {
        name: name,
        userID: userID
      }
    ).then(function (data) {
      if (data[0] === 0) {
        reject(new Error('There is no document for the user ID and name passed in.'));
      } else {
        resolve();
      }
    }).catch(function (error) {
      reject(error);
    });
  });
}

/**
 * Deletes a document based on it's name and user ID.
 * 
 * @param {string} name The name of the document to be deleted.
 * @param {string} userID The ID of the user that owns the document.
 * @returns Promise<Number> The number of deleted documents. This can not excede 1.
 */
function deleteByNameAndUserID (name, userID) {
  return model.destroy({
    where: {
      name: name,
      userID: userID
    },
    limit: 1
  });
}

module.exports = {
  model: model,
  sync: sync,
  findByNameAndUserID: findByNameAndUserID,
  create: create,
  updateContentsForNameAndUserID: updateContentsForNameAndUserID,
  updateNameForNameAndUserID: updateNameForNameAndUserID,
  delete: deleteByNameAndUserID
};
