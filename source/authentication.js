import fs from 'fs';
import jwt from 'jsonwebtoken';
import builder from 'routeBuilder';

export default {

  /**
   * The RSA private key used to sign new JWT tokens when a user signs in.
   */
  private: fs.readFileSync('rsa_private.pem'),

  /**
   * The RSA public ket used to verify incoming JWT tokens.
   */
  public: fs.readFileSync('rsa_public.pem'),

  /**
   * The name of the cookie that the session JWT token is stored in.
   */
  cookie: 'burdoc-session',

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
  authenticate: function (user) {
    var token = jwt.sign(
      {id: user.id, email: user.email, name: user.name}, 
      this.private, 
      {algorithm: 'RS256'}
    );
    this.response.setHeader('Set-Cookie', `${this.cookie}=${token}; Secure; HttpOnly;`);
  },

  /**
   * Verifies a JWT token from the current request.
   * 
   * @param {User} user: The user to verify the JWT token against
   */
  verify: function (user) {
    var token = builder.parseCookies(this.request)[this.cookie];
    var payload = jwt.verify(token, this.public, {
      algorithms: ['RS256']
    });
    if (user.id !== payload.id) {
      this.fail('Failed to verify user. Please login', '/login')
    }
    return payload;
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
