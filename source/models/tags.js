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

/**
 * Creates a tags table if one does not already exist.
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
