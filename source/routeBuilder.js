const fs = require('fs');
const jwt = require('jsonwebtoken');
const authentication = require('./authentication');

function getBody (request, callback) {
  var body = '';
  request.on('data', function (data) {
    body += data;
  });
  request.on('end', function () {
    callback(JSON.parse(body));
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

// Used to prevent multiple route functions from getting called and causing collions because the response is locked twice.
var routeFound = false;

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
    routeFound = false;
  },

  /**
   * Creates a route for a GET request.
   *
   * @param {string} url: The URL the route is called on.
   * @param {function()} handler: The handler called if the route matches the URL and HTTP method.
   */
  get: function (url, handler) {
    if (this.request.method === 'GET' && this.request.url === url && !routeFound) {
      routeFound = true;
      var data = handler();
      this.response.end(data);
    }
  },

  /**
   * @callback handler
   * @param {User} user The user that is authenticated.
   * @return View
   */

  /**
   * Creates a route that is protected by a JWT.
   * 
   * @param {method} method The HTTP method that the request must match.
   * @param {string} url The URL that the request must match.
   * @param {handler} handler A function that is called if the request matches the method and URL.
   * @param {string=} redirectLocation An optional string that is the URL that the user will be redirected to if they are not authenticated. A JSON reponse with an error message will be returned if this is left empty.
   */
  protected: function (method, url, handler, redirectLocation) {
    if (this.request.method === method && this.request.url === url && !routeFound) {
      routeFound = true;
      var cookies = parseCookies(this.request);
      var userJwt = cookies[authentication.headerName];
      if (userJwt) {
        jwt.verify(userJwt, authentication.key, (error, user) => {
          if (!error) {
            var data = handler(user);
            this.response.end(data);
          } else {
            var redirect = !!redirectLocation;
            var option = redirect ? redirectLocation : error;
            authentication.fail(option, redirect);
          }
        });
      } else {
        var redirect = !!redirectLocation;
        var option = redirect ? redirectLocation : 'You must authenticate to access this route';
        authentication.fail(option, redirect);
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
    if (this.request.method === 'GET' && urlRegex.test(this.request.url) && !routeFound) {
      routeFound = true;
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
    if (this.request.method === 'GET' && this.request.url === url && !routeFound) {
      routeFound = true;
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
    if (this.request.method === 'GET' && this.request.url === url && !routeFound) {
      routeFound = true;
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
    if (this.request.method === 'GET' && this.request.url === url && !routeFound) {
      routeFound = true;
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
    if (this.request.method === 'GET' && this.request.url === url && !routeFound) {
      routeFound = true;
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
  post: function (url, handler) {
    if (this.request.method === 'POST' && this.request.url === url && !routeFound) {
      routeFound = true;
      getBody(this.request, (data) => {
        var view = handler(data);
        this.response.end(view);
      });
    }
  }
};
