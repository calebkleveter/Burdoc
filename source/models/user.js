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

function sync() {
  model.sync({force: false})
       .then(function(){
         console.log("Synced user table");
       })
       .catch(function(error){
         console.error("Failed to sync user table: ", error);
       });
}

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

function authenticate(name, password) {
  fetch(name).then(function(user){
    argon2.varify(user.password, password)
          .then(function(didMatch){
            return new Promise(function(resolve, reject){
              if (didMatch) { resolve(user) }
              else { reject(new Error("Password did not match with the email/username.")) }
            });
          })
          .catch(function(error){
            return new Promise(function(resolve, reject){ reject(error) });
          });
  }).catch(function(error){
    return new Promise(function(resolve, reject){ reject(error) });
  });
}

function addDocumentLinkToUser(link, name) {
  model.update(
    {documents: database.sequelize.fn('array_append', database.sequelize.col('documents'), link)},
    {where: { name: name, $or: [{email: name}]}}
  );
}

module.exports = {
  model: model,
  sync: sync,
  fetch: fetch,
  create: create,
  authenticate: authenticate,
  addDocumentLinkToUser: addDocumentLinkToUser
}
