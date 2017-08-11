Vue.component('burdoc-signup-form', {
  props: ['submittext'],
  template: `
  <div class="form">
    <div v-if='isSubmitting' class="loading-indicator">
     <i class="fa fa-cog fa-5x fa-spin" aria-hidden="true"></i>
    </div>
    <form v-else>
      <div class="form-group">
        <label for="username">Username:</label>
        <input type="text" name="username" v-model='username' class="form-control" id="username" @keydown="reset" placeholder="Username">
      </div>
      <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" name="email" v-model='email' class="form-control" id="email" @keydown="reset" placeholder="Email">
      </div>
      <div class="form-group">
        <label for="password">Password:</label>
        <input type="password" name="password" v-model='password' class="form-control" id="password"@keydown="reset"  placeholder="Password">
      </div>
      <div v-if='error' class="error-message">
        <p>{{ error }}</p>
      </div>
      <button type="button" class="btn btn-default" id="signup-btn" :disabled="error != ''" @click="signup">{{ submittext }}</button>
    </form>
  </div>
  `,
  data: function () {
    return {
      isSubmitting: false,
      username: '',
      email: '',
      password: '',
      error: ''
    };
  },
  methods: {
    signup: function () {
      this.isSubmitting = true;
      socket.emit('signup', {
        username: this.username,
        email: this.email,
        password: this.password
      });
      socket.on('signupSuccess', () => {
        this.isSubmitting = false;
        console.log('Success!');
      });
      socket.on('signupError', (error) => {
        this.isSubmitting = false;
        this.error = error;
      });
    },
    
    reset: function () {
      this.error = '';
    }
  }
});