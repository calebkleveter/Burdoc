const socketio = require('socket.io');
const authentication = require('./authentication');
const user = require('./models/user');
const document = require('./models/document');

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
    this.login();
    this.checkForAuthorization();
    this.createDocument();
  },

  /**
   * Attempts to create a user from the data sent from the client on the 'signup' event.
   */
  signup: function () {
    this.socket.on('signup', (data) => {
      user.create(data.username, data.email, data.password)
        .then(() => {
          authentication.setAuthHeader(data.username, data.password);
          this.socket.emit('signupSuccess');
        })
        .catch((error) =>
          this.socket.emit('signupError', error.message)
        );
    });
  },

  /**
   * Attempts to authenticate an existing user from the data sent from the client on the 'login' socket event.
   */
  login: function () {
    this.socket.on('login', (data) => {
      user.authenticate(data.username, data.password)
        .then((user) => {
          authentication.setAuthHeader(data.username, data.password);
          this.socket.emit('loginSuccess', user);
        })
        .catch((error) => {
          this.socket.emit('loginError', error.message);
        });
    });
  },

  /**
   * Checks to seee if a user is authenticated on the 'checkForAuthorization' socket event.
   */
  checkForAuthorization: function () {
    this.socket.on('checkForAuthorization', () => {
      if (authentication.header !== undefined) {
        this.socket.emit('authorized');
      }
    });
  },

  /**
   * Attempts to create a new document for the current user.
   */
  createDocument: function () {
    this.socket.on('createDocument', (data) => {
      user.fetchByName(authentication.currentUser).then((user) => {
        document.create(user.id, data.name, '').then((userModel) => {
          this.socket.emit('documentCreated', {url: `${authentication.currentUser}/${userModel.url}`});
        }).catch((error) => {
          this.socket.emit('documentCreationError', error.message);
        });
      });
    });
  }
};

module.exports.configure = configure;
