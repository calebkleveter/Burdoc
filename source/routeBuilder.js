import jwt from 'jsonwebtoken';
import authentication from './authentication';

function getBody (request, callback) {
  var body = '';
  request.on('data', function (data) {
    body += data;
  });
  request.on('end', function () {
    if (body) {
      callback(JSON.parse(body));
    } else {
      callback(undefined);
    }
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
   * Extracts the cookies from a request as an object.
   *
   * @param {http.IncomingMessage} request: The request to get the cookies from
   * @returns {Object}: An object where the key is the name of the cookie and the value is the value of the cookie.
   */
  parseCookies: parseCookies,

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
    var urlMatches = false;

    if (typeof url === 'string') {
      urlMatches = url === this.request.url;
    } else {
      urlMatches = url.test(this.request.url);
    }

    if (this.request.method === 'GET' && urlMatches && !routeFound) {
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
    var urlMatches = false;

    if (typeof url === 'string') {
      urlMatches = url === this.request.url;
    } else {
      urlMatches = url.test(this.request.url);
    }

    if (this.request.method === method && urlMatches && !routeFound) {
      routeFound = true;
      var cookies = parseCookies(this.request);
      var userJwt = cookies[authentication.headerName];

      if (userJwt) {
        jwt.verify(userJwt, authentication.key, (error, user) => {
          if (!error) {
            var handlerArguments = {
              user: user,
              request: this.request,
              response: this.response,

              finish: (data) => {
                if (data) {
                  this.response.write(data);
                }
                this.response.end();
              }
            };
            getBody(this.request, function (requestBody) {
              handlerArguments.body = requestBody;
              handler(handlerArguments);
            });
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
   * Creates a route for a POST request.
   *
   * @param {string} url: The URL the route is called on.
   * @param {string} view: The view that will be written to the response.
   * @param {function(data)} handler: The handler called if the route matches the URL and HTTP method.
   */
  post: function (url, handler) {
    var urlMatches = false;

    if (typeof url === 'string') {
      urlMatches = url === this.request.url;
    } else {
      urlMatches = url.test(this.request.url);
    }

    if (this.request.method === 'POST' && urlMatches && !routeFound) {
      routeFound = true;
      getBody(this.request, (data) => {
        handler(data, (view) => {
          this.response.end(view);
        });
      });
    }
  },

  /**
   * Verifies the incoming request. If authentication fails,
   * redirect information is written to the response and the response is closed.
   * If authentication succeeds, the next method in the call chain will be executed.
   *
   * @param {string} redirect: The path to redirect to if authentication fails.
   * @returns {routeBuilder}: A route builder so route handlers can be chained to the authentication call.
   */
  guard: function (redirect) {
    authentication.setRequestAndResponse(this.request, this.response);
    var payload = authentication.verify(redirect);
    this.request.payload = payload;
    return this;
  }
};
