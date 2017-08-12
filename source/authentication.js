const crypto = require('crypto');

var authentication = {
    /**
   * Sets the server the authentication middleware will connect to.
   * 
   * @param {http.ClientRequest} server: The server the middleware will connect to.
   */
  setServer: function (server)  {
    this.server = server;
  }
};

module.exports = authentication