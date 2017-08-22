const qs = require('querystring');

function parseBody (request, callback) {
  var body = '';
  request.on('data', function (data) {
    body += data;
  });
  request.on('end', function () {
    callback(qs.parse(body));
  });
}

module.exports = {
  /**
   * Sets the request and response objects that will be used to create and return the proper data to the client.
   *
   * @param {http.IncomingMessage} request: The request from the Node http server.
   * @param {http.ServerResponse} response: The reponse from the Node http server.
   */
  setRequestAndResponse: function (request, response) {
    this.request = request;
    this.response = response;
  },

  /**
   * Creates a route for a GET request.
   *
   * @param {string} url: The URL the route is called on.
   * @param {function()} handler: The handler called if the route matches the URL and HTTP method.
   */
  get: function (url, handler) {
    if (this.request.method === 'GET' && this.request.url === url) {
      var data = handler();
      this.response.end(data);
    }
  },

  /**
   * Creates a route for a GET request based off of a regex pattern
   * 
   * @param {string} urlPattern The RegExp pattern the request's url should match.
   * @param {function(http.ClientRequest)-><string>} handler A function that takes in the clients request and returns the data that will be sent to the client.
   */
  regexGet: function (urlPattern, handler) {
    var urlRegex = new RegExp(urlPattern, 'g');
    if (this.request.method === 'GET' && urlRegex.test(this.request.url)) {
      var data = handler(this.request);
      this.response.end(data);
    }
  },

  /**
   * Creates a route for getting a CSS file.
   *
   * @param {string} url: The URL the route is called on.
   * @param {function()} handler: The handler called if the route matches the URL and HTTP method.
   */
  getCSS: function (url, handler) {
    if (this.request.method === 'GET' && this.request.url === url) {
      var data = handler();
      this.response.setHeader('Content-Type', 'text/css');
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
  getImage: function (url, imageType, handler) {
    if (this.request.method === 'GET' && this.request.url === url) {
      var data = handler();
      this.response.setHeader('Content-Type', `image/${imageType}`);
      this.response.end(data);
    }
  },

  /**
   * Creates a route for getting a JavaScript file.
   *
   * @param {string} url: The URL the route is called on.
   * @param {function()} handler: The handler called if the route matches the URL and HTTP method.
   */
  getJavaScript: function (url, handler) {
    if (this.request.method === 'GET' && this.request.url === url) {
      var data = handler();
      this.response.setHeader('Content-Type', 'application/javascript');
      this.response.end(data);
    }
  },

  /**
   * Creates a route for getting a font file.
   *
   * @param {string} url: The URL the route is called on.
   * @param {function()} handler: The handler called if the route matches the URL and HTTP method.
   */
  getFont: function (url, fontType, handler) {
    if (this.request.method === 'GET' && this.request.url === url) {
      var data = handler();
      this.response.setHeader('Content-Type', `font/${fontType}`);
      this.response.end(data);
    }
  },

  /**
   * Creates a route for a POST request.
   *
   * @param {string} url: The URL the route is called on.
   * @param {string} view: The view that will be written to the response.
   * @param {function(data)} handler: The handler called if the route matches the URL and HTTP method.
   */
  post: function (url, view, handler) {
    if (this.request.method === 'POST' && this.request.url === url) {
      this.response.end(view);
      parseBody(this.request, function (formData) {
        handler(formData);
      });
    }
  }
};
