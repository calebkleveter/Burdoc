const socketio = require('socket.io');

function configure (server) {
  const io = socketio(server);

  io.on('connection', function (socket) {
    console.log('Socket connected');
  });
}

module.exports.configure = configure;
