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

module.exports = {
  model: model,
  sync: sync,
  findByNameAndUserID: findByNameAndUserID
};
