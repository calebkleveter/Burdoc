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

module.exports = {
  model: model,
  sync: sync
};
