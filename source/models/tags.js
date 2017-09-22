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

function create (name) {
  return new Promise(function (resolve, reject) {
    findByName(name).then(function (tag) {
      if (tag == null) {
        return model.create({
          name: name
        });
      } else {
        resolve(tag);
      }
    }).then(function () {
      findByName(name).then(function (tag) {
        resolve(tag);
      });
    }).catch(function (error) {
      reject(error);
    });
  });
}

function findByName (name) {
  return model.findOne({
    where: {
      name: name
    }
  });
}

function fetchByID (id) {
  return model.findAll({
    where: {
      id: id
    }
  });
}

module.exports = {
  model: model,
  sync: sync,
  findByName: findByName,
  create: create,
  fetchByID: fetchByID
};
