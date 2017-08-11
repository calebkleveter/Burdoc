const socketio = require('socket.io');

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
  
}

module.exports.configure = configure;
