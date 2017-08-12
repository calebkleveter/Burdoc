const crypto = require('crypto');

var authentication = {
    /**
   * Sets the server the authentication middleware will connect to.
   * 
   * @param {http.ClientRequest} server: The server the middleware will connect to.
   */
  setServer: function (server)  {
    this.server = server;
  },
  
  /**
   * Creates an authentication header from a username and password and sets the result to the `header` property.
   * 
   * @param {string} username: The username for the user during the current session.
   * @param {string} password: The users password.
   */
  setAuthHeader: function (username, password) {
    this.header = new Buffer.from(`${username}:${password}`).toString('base64');
    this.currentUser = username;
  }
};

module.exports = authentication;