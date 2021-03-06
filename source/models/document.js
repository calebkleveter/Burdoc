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

function findByURLAndUserID (url, userID) {
  return model.findOne({
    where: {
      url: url,
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
 * @returns Promise<document> The document that was created.
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
        }).then(function (user) {
          resolve(user);
        }).catch(function (error) {
          reject(error);
        });
      } else {
        throw new Error('A document already exists with that name and user ID');
      }
    }).catch(function (error) {
      reject(error);
    });
  });
}

/**
 * Deletes a document with a specified ID.
 * 
 * @param {Number} id The ID of the document that will be deleted.
 * @returns Promise<>
 */
function deleteWithID (id) {
  return new Promise(function (resolve, reject) {
    model.destroy({
      where: {
        id: id
      }
    }).then(function (destroyedRows) {
      if (destroyedRows > 0) {
        resolve();
      } else {
        reject(new Error('No document exists with the specified ID.'));
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
      {where: {
        name: name,
        userID: userID
      }}
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
 * Updates the document's name that matches an ID.
 * 
 * @param {string} newName The new name for the document.
 * @param {Number} id The ID of the document that will be updated.
 * @returns Promise<>
 */
function updateNameWithID (newName, id) {
  return new Promise(function (resolve, reject) {
    model.update(
      {
        name: newName,
        url: slug(newName)
      },
      {where: {
        id: id
      }}
    ).then(function (data) {
      if (data[0] === 0) {
        reject(new Error('There is no document for the ID passed in.'));
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
      {where: {
        name: name,
        userID: userID
      }}
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

/**
 * Gets all documents from the database that belong to a certain user.
 * 
 * @param {string} userID The ID of the user that the documents are for.
 * @returns Promise<Array<documents>> The documents belonging to the user ID.
 */
function fetchAllForUserID (userID) {
  return model.findAll({
    where: {
      userID: userID
    }
  });
}

module.exports = {
  model: model,
  sync: sync,
  findByNameAndUserID: findByNameAndUserID,
  findByURLAndUserID: findByURLAndUserID,
  create: create,
  updateNameWithID: updateNameWithID,
  updateContentsForNameAndUserID: updateContentsForNameAndUserID,
  updateNameForNameAndUserID: updateNameForNameAndUserID,
  delete: deleteByNameAndUserID,
  deleteWithID: deleteWithID,
  fetchAllForUserID: fetchAllForUserID
};
