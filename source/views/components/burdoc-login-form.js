Vue.component('burdoc-login-form', {
  props: ['submittext'],
  template: `
  <div class="form">
    <form>
      <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" name="email" v-model='email' class="form-control" id="email" placeholder="Email">
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
      email: '',
      password: ''
    };
  },
  methods: {
    login: function () {
      socket.emit('login', {
        email: this.email,
        password: this.password
      });
    }
  }
});
