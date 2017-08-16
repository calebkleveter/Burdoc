const Sequelize = require('sequelize');
const database = require('../database');

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

module.exports = {
  model: model
};
