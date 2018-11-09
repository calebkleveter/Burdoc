const route = require('./routeBuilder');
const document = require('./models/document');
const documentTag = require('./models/document-tag');
const tag = require('./models/tags');

/**
 * Register the routes with the server's request and response.
 * 
 * @param {http.IncomingMessage} request: The request passed into the `.createServer` callback.
 * @param {http.ServerResponse} response: The response passed into the `.createServer` callback.
 */
function registerRoutes (request, response) {
  if (request && response) {
    route.setRequestAndResponse(request, response);
  }
  createDocument();
  userDocuments();
  documentTags();
  allDocumentTags();
  removeDocumentTag();
  createTag();
}

/**
 * Creates a route at the path /create-document to create a new document for the current user,
 * 
 */
function createDocument () {
  route.protected(route.method.post, '/create-document', function (args) {
    document.create(args.user.id, args.body.name, '').then(function (documentModel) {
      var doc = {
        url: `document/${args.user.name}/${documentModel.dataValues.url}`
      };
      args.finish(JSON.stringify(doc));
    }).catch(function (error) {
      args.finish(JSON.stringify({error: error.message}));
    });
  });
}

/**
 * A route for fetching the documents for a user's dashboard.
 */
function userDocuments () {
  route.protected(route.method.post, '/user-documents', function (args) {
    document.fetchAllForUserID(args.user.id).then(function (documents) {
      var data = [];
      documents.forEach(function (doc) {
        var title = '';
        if (doc.dataValues.name.length > 24) {
          title = `${doc.dataValues.name.substring(0, 21)}...`;
        } else {
          title = doc.dataValues.name;
        }
        data.push({
          title: title,
          titleCharacter: doc.dataValues.name[0],
          url: `document/${args.user.name}/${doc.dataValues.url}`,
          id: doc.id
        });
      });
      args.finish(JSON.stringify(data));
    }).catch(function (error) {
      args.finish(JSON.stringify({error: error.message}));
    });
  });
}

/**
 * Creates a route at the path /all-tags to fetch all tags for all the user's documents.
 */
function allDocumentTags () {
  route.protected(route.method.post, '/all-tags', function (args) {
    document.fetchAllForUserID(args.user.id).then(function (docs) {
      var tagFetchers = docs.map(function (doc) {
        return document.fetchTagsForID(doc.id);
      });

      return Promise.all(tagFetchers);
    }).then(function (models) {
      var documentTags = {};
      models.forEach(function (model) {
        var tags = model.tags.map(function (tag) {
          return {
            id: tag.id,
            name: tag.name
          };
        });
        documentTags[model.documentID] = tags;
      });
      args.finish(JSON.stringify(documentTags));
    }).catch(function (error) {
      args.finish(JSON.stringify({error: error.message}));
    });
  });
}

/**
 * Creates a route at the path /document-tags to get all of a document's tags.
 */
function documentTags () {
  route.protected(route.method.post, '/document-tags', function (args) {
    document.findByNameAndUserID(args.body.name, args.user.id).then(function (doc) {
      return document.fetchTagsForID(doc.id);
    }).then(function (model) {
      var tags = model.tags.map(function (model) {
        return {
          id: model.id,
          name: model.name
        };
      });

      args.finish(JSON.stringify(tags));
    }).catch(function (error) {
      args.finish(JSON.stringify({error: error.message}));
    });
  });
}

/**
 * Creates a route at the path /remove-document-tag to remove a tag from a document.
 */
function removeDocumentTag () {
  route.protected(route.method.post, '/remove-document-tag', function (args) {
    documentTag.deleteWithDocumentAndTagID(args.body.documentID, args.body.tagID).then(function () {
      args.finish();
    }).catch(function (error) {
      args.finish(JSON.stringify({error: error.message}));
    });
  });
}

/**
 * Creates a route at the path '/create-tag' to create a new tag for a document.
 * 
 */
function createTag () {
  route.protected(route.method.post, '/create-tag', function (args) {
    var newTag;
    tag.create(args.body.tagName).then(function (model) {
      newTag = model.dataValues;
      return documentTag.create(args.body.documentID, model.id);
    }).then(function () {
      args.finish(JSON.stringify(newTag));
    }).catch(function (error) {
      console.error(error);
      args.finish(JSON.stringify({error: error.message}));
    });
  });
}

module.exports = {
  registerRoutes: registerRoutes
};
