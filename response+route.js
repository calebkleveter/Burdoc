const http = require('http');

/**
 * Creates a route for a GET request.
 *
 * @param {string} url: The URL the route is called on.
 * @param {function()} handler: The handler called if the route matches the URL and HTTP method.
 */
http.IncomingMessage.prototype.get = function(url, handler) {
  if (this.method == 'GET' && this.url == url) {
    handler();
  }
}

/**
 * Creates a route for a POST request.
 *
 * @param {string} url: The URL the route is called on.
 * @param {function()} handler: The handler called if the route matches the URL and HTTP method.
 */
http.IncomingMessage.prototype.post = function(url, handler) {
  if (this.method == 'POST' && this.url == url) {
    handler();
  }
}

module.exports.get = get;
module.exports.post = post;
