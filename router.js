const route = require('./routeBuilder');

module.exports = {
  /**
   * Sets the router's request and response to use in creating routes.
   *
   * @param {http.IncomingMessage} request: The request object for creating routes.
   * @param {http.ServerResponse} response: The response object for creating routes.
   */
  setRequestAndResponse: function(request, response) {
    this.request = request;
    this.response = response;
  }
}
