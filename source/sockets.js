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
    socket.on('login', function (data) {
      console.log(data);
    });
  });
}

/**
 * Handels the socket events received from the client.
 */
var receiverEvents = {
  
  /**
   * Sets the socket the receiver event functions will connect to and registers the events with it.
   * 
   * @param {socketio.Socket} socket: The socket the events will be handled on.
   */
  registerWithSocket: function (socket) {
    this.socket = socket;
    this.signup(socket);
  },
  
  /**
   * Attempts to create a user from the data sent from the client on the 'signup' event.
   * 
   * @param {socketio.Socket} socket: The socket the event should be listened for on.
   */
  signup: function (socket) {
    socket.on('signup', function (data) {
      try {
        user.create(data.username, data.email, data.password);
        socket.emit('signupSuccess');
      } catch (error) {
        socket.emit('signupError', error);
      }
    });
  }
};

module.exports.configure = configure;
