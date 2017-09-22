const route = require('./routeBuilder');
const assetRouter = require('./asset-router');
const view = require('./view');
const authentication = require('./authentication');
const user = require('./models/user');
const document = require('./models/document');

module.exports = {
  /**
   * Registers the router's routes with a request and response.
   *
   * @param {http.IncomingMessage} request: The request object for creating routes.
   * @param {http.ServerResponse} response: The response object for creating routes.
   */
  registerRoutes: function (request, response) {
    route.setRequestAndResponse(request, response);
    assetRouter.registerRoutes(request, response);
    this.home();
    this.about();
    this.login();
    this.loginPost();
    this.signup();
    this.signupPost();
    this.dashboard();
    this.logout();
    this.editor();

    this.userDocuments();
  },

  // MARK: - App Page Routes

  /**
   * The route for the root path, which sends the home.html view to the reponse.
   */
  home: function () {
    route.get('/', function () {
      return view.get('home');
    });
  },

  /**
   * The route for the /about path, which sends the about.html view to the reponse.
   */
  about: function () {
    route.get('/about', function () {
      return view.get('about');
    });
  },

  /**
   * The route for the /login path, which sends the login.html view to the reponse.
   */
  login: function () {
    route.get('/login', function () {
      return view.get('login');
    });
  },

  /**
   * The route for the /login path on a POST request.
   * It attempts to authenticate the user based on the data from the request body.
   */
  loginPost: function () {
    route.post('/login', function (data, finish) {
      user.authenticate(data.username, data.password).then(function (model) {
        authentication.setAuthHeader(model);
        finish(view.get('login'));
      }).catch(function (error) {
        authentication.response.setHeader('Auth-Error', error.message);
        finish(view.get('login'));
      });
    });
  },

  /**
   * The route for the /signup path, which sends the signup.html view to the reponse.
   */
  signup: function () {
    route.get('/signup', function () {
      return view.get('signup');
    });
  },

  /**
   * The route for the /signup path on a POST request. 
   * A user is created from the data from the request body and is then authenticated.
   */
  signupPost: function () {
    route.post('/signup', function (data, finish) {
      user.create(data.username, data.email, data.password).then(function (model) {
        authentication.setAuthHeader(model);
        finish(view.get('signup'));
      }).catch(function (error) {
        authentication.response.setHeader('Auth-Error', error.message);
        finish(view.get('signup'));
      });
    });
  },

  /**
   * The route for the /dashboard path, which sends the dashboard.html view to the reponse.
   */
  dashboard: function () {
    route.protected(route.method.get, '/dashboard', function (args) {
      args.finish(view.get('dashboard'));
    }, '/login');
  },

  /**
   * The route for the /logout path, which logs out the current user.
   */
  logout: function () {
    route.get('/logout', function () {
      authentication.response.statusCode = 303;
      authentication.response.setHeader('location', '/');
      authentication.resetAuthHeader();
    });
  },

  /**
   * A route for any /document/.../... path.
   */
  editor: function () {
    route.protected(route.method.get, /\/document\/[\w]+\/.+/, function (args) {
      var user = args.request.url.split('/')[2];
      if (args.user.name === user) {
        args.finish(view.get('editor'));
      } else {
        args.response.statusCode = 303;
        args.response.setHeader('location', '/dashboard');
        args.response.setHeader('Auth-Error', 'You need to be logged in as a collaborator for this document to view it.');
        args.finish();
      }
    }, '/dashboard');
  },

  // MARK: - Page Support Routes

  /**
   * A route for fetching the documents for a user's dashboard.
   */
  userDocuments: function () {
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
};
