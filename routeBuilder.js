const http = require('http');

module.exports = {
  /**
   * Sets the request object that will be used to detect the HTTP method and URL.
   *
   * @param {http.IncomingMessage} request:
   */
  setRequest: function(request) {
    this.request = request;
  }

  /**
   * Creates a route for a GET request.
   *
   * @param {string} url: The URL the route is called on.
   * @param {function()} handler: The handler called if the route matches the URL and HTTP method.
   */
  get: function(url, handler) {
    if (this.request.method == 'GET' && this.request.url == url) {
      handler();
    }
  },

  /**
   * Creates a route for a POST request.
   *
   * @param {string} url: The URL the route is called on.
   * @param {function()} handler: The handler called if the route matches the URL and HTTP method.
   */
  post: function(url, handler) {
    if (this.request.method == 'POST' && this.request.url == url) {
      handler();
    }
  }
}
