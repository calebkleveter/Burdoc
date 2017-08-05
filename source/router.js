const route = require('./routeBuilder');
const assetRouter = require('./asset-router');
const view = require('./view');
const fs = require('fs');
const user = require('./models/user');

module.exports = {
  /**
   * Registers the router's routes with a request and response.
   *
   * @param {http.IncomingMessage} request: The request object for creating routes.
   * @param {http.ServerResponse} response: The response object for creating routes.
   */
  registerRoutes: function(request, response) {
    route.setRequestAndResponse(request, response);
    assetRouter.registerRoutes(request, response);
    this.home();
    this.about();
    this.login();
    this.signup();
    this.dashboard();
    response.end();
  },

  /**
   * The route for the root path, which sends the home.html view to the reponse.
   */
  home: function() {
    route.get('/', function(){
      return view.get('home');
    });
  },

  /**
   * The route for the /about path, which sends the about.html view to the reponse.
   */
  about: function() {
    route.get('/about', function(){
      return view.get('about');
    });
  },

  /**
   * The route for the /login path, which sends the login.html view to the reponse.
   */
  login: function() {
    route.get('/login', function(){
      return view.get('login');
    });
  },

  /**
   * The route for the /signup path, which sends the signup.html view to the reponse.
   */
  signup: function() {
    route.get('/signup', function(){
      return view.get('signup');
    });
  },

  /**
   * The route for the /dashboard path, which sends the dashboard.html view to the reponse.
   */
  dashboard: function() {
    route.get('/dashboard', function(){
      return view.get('dashboard');
    });
  }
}
