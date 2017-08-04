const route = require('./routeBuilder');
const assetRouter = require('./asset-router');
const view = require('./view');
const fs = require('fs');

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
    response.end();
  },

  home: function() {
    route.get('/', function(){
      return view.get('home');
    });
  },

  about: function() {
    route.get('/about', function(){
      return view.get('about');
    });
  },

  login: function() {
    route.get('/login', function(){
      return view.get('login');
    });
  },

  signup: function() {
    route.get('/signup', function(){
      return view.get('signup');
    });
  }
}
