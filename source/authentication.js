const jwt = require('jsonwebtoken');
const crypto = require('crypto');

var authentication = {

  /**
   * The name of the header that is used for authentication
   */
  headerName: '',

  /**
   * The key to use when varifying against a JWT.
   */
  key: '',

  /**
   * Sets the request and response that the authentication middleware will connect to.
   * 
   * @param {http.IncomingMessage} request: The request sent by the client that the middleware will connect to.
   * @param {http.ServerResponse} response: The response from the server to the client that the middleware will connect to.
   */
  setRequestAndResponse: function (request, response) {
    this.request = request;
    this.response = response;
  },

  /**
   * Sets an authentication header to the response from a user..
   * 
   * @param {User} user: The user for the current session.
   */
  setAuthHeader: function (user) {
    this.headerName = crypto.randomBytes(16).toString('hex');
    this.key = crypto.randomBytes(16).toString('hex');
    var token = jwt.sign({id: user.id, email: user.email, name: user.name}, this.key);
    this.response.setHeader('Set-Cookie', `${this.headerName}=${token}; Secure; HttpOnly;`);
  },

  /**
   * Resets the `headerName` and `key` properties to undifined, logout the user.
   */
  resetAuthHeader: function () {
    var now = new Date();
    now.setTime(now.getTime());
    this.response.setHeader('Set-Cookie', `${this.headerName}=''; expires=${now.toUTCString()}; Secure; HttpOnly;`);
    this.headerName = undefined;
    this.key = undefined;
  },

  /**
   * Fail an attempted authentication or accessing a protected route by redirecting or returning a message.
   * 
   * @param {string} option The error message that will be returned in JSON or the route to redirect to.
   * @param {bool=} redirect If true, we redirect, otherwise we display an error. This value defaults to false.
   */
  fail: function (option, redirect = false) {
    if (redirect) {
      this.response.statusCode = 303;
      this.response.setHeader('location', option);
    } else {
      this.response.statusCode = 401;
      this.response.write(`
      {
        "message": "${option}"
      }
      `);
    }
    this.response.end();
  }
};

module.exports = authentication;
