const route = require('./routeBuilder');
const view = require('./view');
const fs = require('fs');

module.exports = {
  /**
   * Registers the router's routes with a request and response.
   *
   * @param {http.IncomingMessage} request: The request object for creating routes.
   * @param {http.ServerResponse} response: The response object for creating routes.
   */
  registerRoutes: function(request, response) {
    route.setRequestAndResponse(request, response);
    this.home();
    this.about();
    this.login();
    this.signup();
    this.css();
    this.js();
    this.calebImage()
    this.burdocImage()
    response.end();
  },

  home: function() {
    route.get('/', function(){
      return view.get('home');
    });
  },

  about: function() {
    route.get('/about', function(){
      return view.get('about');
    });
  },

  login: function() {
    route.get('/login', function(){
      return view.get('login');
    });
  },

  signup: function() {
    route.get('/signup', function(){
      return view.get('signup');
    });
  },

  css: function() {
    route.getCSS('/css/main.css', function(){
      var css = fs.readFileSync(`${__dirname}/views/css/bootstrap.min.css`);
      css += fs.readFileSync(`${__dirname}/views/css/main.css`);
      return css;
    });
  },

  js: function() {
    route.getJavaScript('/js/index.js', function(){
      var js = fs.readFileSync(`${__dirname}/views/js/jquery-3.2.1.min.js`);
      js += fs.readFileSync(`${__dirname}/views/js/bootstrap.min.js`);
      js += fs.readFileSync(`${__dirname}/views/js/vue.js`);
      js += fs.readFileSync(`${__dirname}/views/components/burdoc-header.js`);
      js += fs.readFileSync(`${__dirname}/views/components/burdoc-form.js`);
      js += fs.readFileSync(`${__dirname}/views/js/index.js`);
      return js;
    });
  },

  calebImage: function() {
    route.getImage('/images/caleb.jpg', 'jpeg', function(){
      return fs.readFileSync(`${__dirname}/views/images/caleb.JPG`);
    });
  },

  burdocImage: function() {
    route.getImage('/images/burdoc.svg', 'svg+xml', function(){
      return fs.readFileSync(`${__dirname}/views/images/burdoc.svg`);
    });
  }
}
