const route = require('./routeBuilder');
const authentication = require('./authentication');
const user = require('./models/user');
const document = require('./models/document');
const documentTag = require('./models/document-tag');
const tag = require('./models/tags');

function registerRoutes () {
  userDocuments();
  documentTags();
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
      args.finish(`${{error: error.message}}`);
    });
  });
}

function documentTags () {
  route.protected(route.method.get, '/document-tags', function (args) {
    var documentsComplete = 0;
    var tags = {};
    document.fetchAllForUserID(args.user.id).then(function (documents) {
      documents.forEach(function (doc) {
        tags[doc.id] = [];
        documentTag.fetchAllByDocumentID(doc.id).then(function (pivots) {
          pivots.forEach(function (pivot) {
            tag.fetchByID(pivot.tagID).then(function (documentTag) {
              tags[doc.id].push(documentTag);
              if (documentsComplete > documents.length) {
                args.finish(tags);
              }
            });
          });
        });
      });
    });
  });
}

module.exports = {
  registerRoutes: registerRoutes
};
