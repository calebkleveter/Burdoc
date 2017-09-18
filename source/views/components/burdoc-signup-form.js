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
      this.$http.post('/signup', {
        username: this.username,
        email: this.email,
        password: this.password
      }).then((response) => {
        if (response.headers.has('Auth-Error')) {
          this.isSubmitting = false;
          this.error = response.headers.get('Auth-Error');
        } else {
          window.location.href = '/dashboard';
        }
      }).catch((error) => {
        this.error = error.message;
      });
    },

    reset: function () {
      this.error = '';
    }
  }
});
