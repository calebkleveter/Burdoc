Vue.component('burdoc-header', {
  props: ['loggedIn'],
  template: `
  <header>
    <nav class="navbar navbar-inverse">
      <div class="container-fluid" id="navigation">
        <div class="navbar-header col-sm-12 col-md-12 col-lg-12">
          <div class="logo-link col-xs-12 col-sm-12 col-md-2 col-lg-2">
            <a class="" href="/">
              <div class="logo">
                <img src="/images/burdoc.svg" alt="Alt">
                <h1>B<span class="small-title">URDOC</span></h1>
              </div>
            </a>
          </div>
          <div class="col-xs-0 col-sm-0 col-md-5 col-lg-6"></div>
          <div class="navigation col-xs-12 col-sm-12 col-md-5 col-lg-4">
            <ul class="nav-links nav navbar-nav nav-bar" v-for="link in links">
              <li><a :href="link.url">{{ link.name }}</a></li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  </header>
  `,
  data: function () {
    return {
      links: [
        {url: '/signup', name: 'Sign Up'}, 
        {url: '/login', name: 'Login'}, 
        {url: '/about', name: 'About'}, 
        {url: '/', name: 'Home'}
      ]
    };
  },
  
  created: function () {
    socket.emit('checkForAuthorization')
    socket.on('authorized', () => {
      this.links = [
        {url: '/dashboard', name: 'Dashboard'},
        {url: '/logout', name: 'Logout'},
        {url: '/about', name: 'About'}, 
        {url: '/', name: 'Home'}
      ]
    });
  }
});
