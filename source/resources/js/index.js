new Vue({
  el: "#app",
  data: {
    authorized: false
  },
  
  created: function () {
    socket.emit('checkForAuthorization')
    socket.on('authorized', () => {
      this.authorized = true;
    });
  }
});
