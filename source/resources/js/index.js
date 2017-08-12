new Vue({
  el: "#app",
  created: function () {
    socket.emit('checkForAuthorization')
    socket.on('authorized', () => {
      authorized = true;
    });
  }
});
