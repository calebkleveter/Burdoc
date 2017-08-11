Vue.component('burdoc-signup-form', {
  props: ['submittext'],
  template: `
  <div class="form">
    <form>
      <div class="form-group">
        <label for="username">Username:</label>
        <input type="text" name="username" v-model='username' class="form-control" id="username" placeholder="Username">
      </div>
      <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" name="email" v-model='email' class="form-control" id="email" placeholder="Email">
      </div>
      <div class="form-group">
        <label for="password">Password:</label>
        <input type="password" name="password" v-model='password' class="form-control" id="password" placeholder="Password">
      </div>
      <button type="button" class="btn btn-default" id="signup-btn" @click="signup">{{ submittext }}</button>
    </form>
  </div>
  `,
  data: function () {
    return {
      username: '',
      email: '',
      password: ''
    };
  },
  methods: {
    signup: function () {
      socket.emit('signup', {
        username: this.username,
        email: this.email,
        password: this.password
      });
    }
  }
});