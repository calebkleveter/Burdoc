var authentication = {
    /**
   * Sets the request and response that the authentication middleware will connect to.
   * 
   * @param {http.IncomingMessage} request: The request sent by the client that the middleware will connect to.
   * @param {http.ServerResponse} response: The response from the server to the client that the middleware will connect to.
   */
  setRequestAndResponse: function (request, response)  {
    this.request = request;
    this.response = response;
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
  },
  
  /**
   * Resets the `header` and `currentUser` properties to undifined, login out the user.
   */
  resetAuthHeader: function () {
    this.header = undefined;
    this.currentUser = undefined;
  }
};

module.exports = authentication;