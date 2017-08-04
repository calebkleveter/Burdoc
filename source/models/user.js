const Sequelize = require('sequelize');
const database = require('../database');

const model = database.sequelize.define('user', {
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

function fetch(name) {
  return model.findOne({
    where: {
      name: name,
      $or: [
        {email: name}
      ]
    }
  });
}

module.exports = {
  model: model,
  fetch: fetch
}