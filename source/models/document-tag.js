const Sequelize = require('sequelize');
const database = require('../database');

/**
 * The document-tag pivot model for sequelize.
 */
const model = database.sequelize.define('document_tag', {
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
      console.log('Synced document_tag pivot table');
    })
    .catch(function (error) {
      console.error('Failed to sync document-tag table: ', error);
    });
}

function create (documentID, tagID) {
  return new Promise(function (resolve, reject) {
    model.findOne({
      where: {
        documentID: documentID,
        tagID: tagID
      }
    }).then(function () {
      resolve();
    }).catch(function (error) {
      reject(error);
    });
  });
}

function fetchAllByDocumentID (id) {
  return model.findAll({
    where: {
      documentID: id
    }
  });
}

module.exports = {
  model: model,
  sync: sync,
  create: create,
  fetchAllByDocumentID: fetchAllByDocumentID
};
