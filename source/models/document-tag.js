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

module.exports = {
  model: model
};
