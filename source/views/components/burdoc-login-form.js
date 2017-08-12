Vue.component('burdoc-login-form', {
  props: ['submittext'],
  template: `
  <div class="form">
    <form>
      <div class="form-group">
        <label for="username">Username:</label>
        <input type="text" name="username" v-model='username' class="form-control" id="username" placeholder="Username">
      </div>
      <div class="form-group">
        <label for="password">Password:</label>
        <input type="password" name="password" v-model='password' class="form-control" id="password" placeholder="Password">
      </div>
      <button type="button" class="btn btn-default" id="signup-btn" @click="login">{{ submittext }}</button>
    </form>
  </div>
  `,
  data: function () {
    return {
      username: '',
      password: ''
    };
  },
  methods: {
    login: function () {
      socket.emit('login', {
        username: this.username,
        password: this.password
      });
    }
  }
});
