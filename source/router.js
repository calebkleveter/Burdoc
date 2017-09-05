const route = require('./routeBuilder');
const assetRouter = require('./asset-router');
const view = require('./view');
const authentication = require('./authentication');

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
    this.dashboard();
    this.logout();
    this.editor();
  },

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

  loginPost: function () {
    route.post('/login', function (user) {
      authentication.setAuthHeader(user);
      return view.get('login');
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
   * The route for the /dashboard path, which sends the dashboard.html view to the reponse.
   */
  dashboard: function () {
    route.protected(route.method.get, '/dashboard', function () {
      return view.get('dashboard');
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
   * A temporary route for testing and developing the 'editor'  view.
   */
  editor: function () {
    route.regexGet('\\/document\\/[\\w]+\\/.+', function (request) {
      var user = request.url.split('/')[2];
      if (authentication.header !== undefined && authentication.currentUser === user) {
        authentication.response.setHeader('Authorization', authentication.header);
        return view.get('editor');
      } else {
        authentication.response.writeHead(303, {
          'location': '/dashboard',
          'authentication-error': 'You need to be logged in as a collaborator for this document to view it.'
        });
      }
    });
  }
};
