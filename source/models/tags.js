const Sequelize = require('sequelize');
const database = require('../database');

/**
 * The tags model for sequelize.
 */
const model = database.sequelize.define('tags', {
  name: {
    type: Sequelize.STRING
  }
});

module.exports = {
  model: model
};
