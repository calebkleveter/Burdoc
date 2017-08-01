const http = require('http');

module.exports = {
  /**
   * Sets the request and response objects that will be used to create and return the proper data to the client.
   *
   * @param {http.IncomingMessage} request: The request from the Node http server.
   * @param {http.ServerResponse} response: The reponse from the Node http server.
   */
  setRequestAndResponse: function(request, response) {
    this.request = request;
    this.response = response
  },

  /**
   * Creates a route for a GET request.
   *
   * @param {string} url: The URL the route is called on.
   * @param {function()} handler: The handler called if the route matches the URL and HTTP method.
   */
  get: function(url, handler) {
    if (this.request.method == 'GET' && this.request.url == url) {
      var data = handler();
      this.response.end(data);
    }
  },

  /**
   * Creates a route for getting a CSS file.
   *
   * @param {string} url: The URL the route is called on.
   * @param {function()} handler: The handler called if the route matches the URL and HTTP method.
   */
  getCSS: function(url, handler) {
    if (this.request.method == 'GET' && this.request.url == url) {
      var data = handler();
      this.response.writeHead(200, {"Content-Type": "text/css"});
      this.response.end(data);
    }
  },

  /**
   * Creates a route for getting an image.
   *
   * @param {string} url: The URL the route is called on.
   * @param {string} imageType: The second half of an HTTP header image content type.
   * @param {function()} handler: The handler called if the route matches the URL and HTTP method.
   */
  getImage: function(url, imageType, handler) {
    if (this.request.method == 'GET' && this.request.url == url) {
      var data = handler();
      this.response.writeHead(200, {"Content-Type": `image/${imageType}`});
      this.response.end(data);
    }
  },

  /**
   * Creates a route for getting a JavaScript file.
   *
   * @param {string} url: The URL the route is called on.
   * @param {function()} handler: The handler called if the route matches the URL and HTTP method.
   */
  getJavaScript: function(url, handler) {
    if (this.request.method == 'GET' && this.request.url == url) {
      var data = handler();
      this.response.writeHead(200, {"Content-Type": "application/javascript"});
      this.response.end(data);
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
      var data = handler();
      this.response.end(data);
    }
  }
}
