const Sequelize = require('sequelize');
const database = require('../database');
const argon2 = require('argon2');

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

function create(username, email, password) {
  argon2.hash(password)
        .then(function(hash){
          model.create({
            name: name,
            email: email,
            password: hash,
            documents: []
          });
        })
        .catch(function(error){
          throw error
        });
}

module.exports = {
  model: model,
  fetch: fetch,
  create: create
}
