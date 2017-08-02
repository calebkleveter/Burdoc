Vue.component('burdoc-form', {
  props: ['action', 'method', 'submittext'],
  template: `
  <div class="form">
    <form :action="action" :method="method">
      <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" class="form-control" id="email" placeholder="Email">
      </div>
      <div class="form-group">
        <label for="password">Password:</label>
        <input type="password" class="form-control" id="password" placeholder="Password">
      </div>
      <button type="submit" class="btn btn-default" id="signup-btn">{{ submittext }}</button>
    </form>
  </div>
  `
});
