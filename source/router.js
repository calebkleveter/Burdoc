const route = require('./routeBuilder');
const authentication = require('./authentication');
const user = require('./models/user');

import home from './views/home.html';
import about from './views/about.html';
import login from './views/login.html';
import signup from './views/signup.html';
import dashboard from './views/dashboard.html'
import editor from './views/editor.html';

export default {
  /**
   * Registers the router's routes with a request and response.
   *
   * @param {http.IncomingMessage} request: The request object for creating routes.
   * @param {http.ServerResponse} response: The response object for creating routes.
   */
  registerRoutes: function (request, response) {
    route.setRequestAndResponse(request, response);
    this.home();
    this.about();
    this.login();
    this.loginPost();
    this.signup();
    this.signupPost();
    this.dashboard();
    this.logout();
    this.editor();
  },

  // MARK: - App Page Routes

  /**
   * The route for the root path, which sends the home.html view to the reponse.
   */
  home: function () {
    route.get('/', function () {
      return home;
    });
  },

  /**
   * The route for the /about path, which sends the about.html view to the reponse.
   */
  about: function () {
    route.get('/about', function () {
      return about;
    });
  },

  /**
   * The route for the /login path, which sends the login.html view to the reponse.
   */
  login: function () {
    route.get('/login', function () {
      return login;
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
        finish(login);
      }).catch(function (error) {
        authentication.response.setHeader('Auth-Error', error.message);
        finish(login);
      });
    });
  },

  /**
   * The route for the /signup path, which sends the signup.html view to the reponse.
   */
  signup: function () {
    route.get('/signup', function () {
      return signup;
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
        finish(signup);
      }).catch(function (error) {
        authentication.response.setHeader('Auth-Error', error.message);
        finish(signup);
      });
    });
  },

  /**
   * The route for the /dashboard path, which sends the dashboard.html view to the reponse.
   */
  dashboard: function () {
    route.protected(route.method.get, '/dashboard', function (args) {
      args.finish(dashboard);
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
        args.finish(editor);
      } else {
        args.response.statusCode = 303;
        args.response.setHeader('location', '/dashboard');
        args.response.setHeader('Auth-Error', 'You need to be logged in as a collaborator for this document to view it.');
        args.finish();
      }
    }, '/dashboard');
  }
};
