const Sequelize = require('sequelize');
const database = require('../database');

const User = database.sequelize.define('user', {
  name: {
    type: Sequelize.STRING
  },
  email: {
    type: Sequelize.STRING
  },
  password: {
    type: Sequelize.STRING
  },
  documents: {
    type: Sequelize.ARRAY(Sequelize.STRING)
  }
});
