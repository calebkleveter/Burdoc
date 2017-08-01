const route = require('./routeBuilder');
const view = require('./view');

module.exports = {
  /**
   * Registers the router's routes with a request and response.
   *
   * @param {http.IncomingMessage} request: The request object for creating routes.
   * @param {http.ServerResponse} response: The response object for creating routes.
   */
  registerRoutes: function(request, response) {
    route.setRequestAndResponse(request, response);
    this.home();
  },

  home: function() {
    route.get('/', function(){
      return view.get('home');
    });
  }
}
