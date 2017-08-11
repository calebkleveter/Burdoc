const socketio = require('socket.io');
const user = require('./models/user');

/**
 * Creates the socket and registers it and it's events with the server.
 * 
 * @param {http.ClientRequest} server: The server the socket should be connected to.
 */
function configure (server) {
  const io = socketio(server);

  io.on('connection', function (socket) {
    console.log('Socket connected');
    receiverEvents.registerWithSocket(socket);
  });
}

/**
 * Handles the socket events received from the client.
 */
var receiverEvents = {
  
  /**
   * Sets the socket the receiver event functions will connect to and registers the events with it.
   * 
   * @param {socketio.Socket} socket: The socket the events will be handled on.
   */
  registerWithSocket: function (socket) {
    this.socket = socket;
    this.signup();
  },
  
  /**
   * Attempts to create a user from the data sent from the client on the 'signup' event.
   */
  signup: function () {
    this.socket.on('signup', (data) =>
      user.create(data.username, data.email, data.password)
        .then(() =>
          this.socket.emit('signupSuccess')
        )
        .catch((error) =>
          this.socket.emit('signupError', error.message)
        )
    );
  }
};

module.exports.configure = configure;
