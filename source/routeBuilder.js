const fs = require('fs');
const jwt = require('jsonwebtoken');
const authentication = require('./authentication');

function getBody (request, callback) {
  var body = '';
  request.on('data', function (data) {
    body += data;
  });
  request.on('end', function () {
    callback(body);
  });
}

function parseCookies (request) {
  var list = {};
  var rc = request.headers.cookie;

  rc && rc.split(';').forEach(function (cookie) {
    var parts = cookie.split('=');
    list[parts.shift().trim()] = decodeURI(parts.join('='));
  });

  return list;
}

var method = {
  get: 'GET',
  post: 'POST',
  put: 'PUT',
  patch: 'PATCH',
  delete: 'DELETE',
  copy: 'COPY',
  head: 'HEAD',
  options: 'OPTIONS',
  link: 'LINK',
  unlink: 'UNLINK',
  purge: 'PURGE',
  lock: 'LOCK',
  unlock: 'UNLOCK',
  propfind: 'PROPFIND',
  view: 'VIEW'
};

module.exports = {

  /**
   * An object containing all existing HTTP methods.
   */
  method: method,

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
   * Creates a route for a Get request that is protected with JWT authentication.
   * 
   * @param {string} url: The URL that the route is called on.
   * @param {function()} handler: The handler called if the route matches the URL and HTTP method from the client.
   * @param {object<Number, Array<Array<string>>>} failOptions: An object that contains that status code and headers that are sent with the response if the user is not authenticated.
   */
  protected: function (url, handler, failOptions) {
    if (this.request.method === 'GET' && this.request.url === url) {
      if (this.request.user) {
        var data = handler();
        this.response.end(data);
      } else {
        this.response.statusCode = failOptions.statusCode;
        for (let header of failOptions.headers) {
          this.response.setHeader(...header);
        }
        this.response.end();
      }
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
   * @param {Array<string>} names: The names of the CSS files that will be loaded to the URL.
   */
  getCSS: function (url, names) {
    if (this.request.method === 'GET' && this.request.url === url) {
      var data = '';

      for (let name of names) {
        data += fs.readFileSync(`${__dirname}/views/css/${name}.css`);
      }

      this.response.setHeader('Content-Type', 'text/css');
      this.response.end(data);
    }
  },

  /**
   * Creates a route for getting an image.
   *
   * @param {string} url: The URL the route is called on.
   * @param {string} imageType: The second half of an HTTP header image content type.
   * @param {string} imageName: The name of the image that will be loaded to the URL.
   */
  getImage: function (url, imageType, imageName) {
    if (this.request.method === 'GET' && this.request.url === url) {
      var data = fs.readFileSync(`${__dirname}/views/images/${imageName}`);
      this.response.setHeader('Content-Type', `image/${imageType}`);
      this.response.end(data);
    }
  },

  /**
   * Creates a route for getting a JavaScript file.
   *
   * @param {string} url: The URL the route is called on.
   * @param {Array<string>} names: The names of the JavaScript files that will be loaded to the URL.
   */
  getJavaScript: function (url, names) {
    if (this.request.method === 'GET' && this.request.url === url) {
      var data = '';

      for (let name of names) {
        try {
          data += fs.readFileSync(`${__dirname}/views/js/${name}.js`);
        } catch (ignore) {}
        try {
          data += fs.readFileSync(`${__dirname}/views/components/${name}.js`);
        } catch (ignore) {}
      }

      this.response.setHeader('Content-Type', 'application/javascript');
      this.response.end(data);
    }
  },

  /**
   * Creates a route for getting a font file.
   *
   * @param {string} url: The URL the route is called on.
   * @param {fstring} handler: The name of the font that will be loaded to the URL.
   */
  getFont: function (url, fontType, fontName) {
    if (this.request.method === 'GET' && this.request.url === url) {
      var data = fs.readFileSync(`${__dirname}/views/fonts/${fontName}`);
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
