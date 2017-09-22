const Sequelize = require('sequelize');
const database = require('../database');

/**
 * The document-tag pivot model for sequelize.
 */
const model = database.sequelize.define('tags', {
  documentID: {
    type: Sequelize.INTEGER
  },
  tagID: {
    type: Sequelize.INTEGER
  }
});

/**
 * Creates a document-tag pivot table if one does not already exist.
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

module.exports = {
  model: model,
  sync: sync
};
