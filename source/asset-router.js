const route = require('./routeBuilder');
const fs = require('fs');

module.exports = {
  /**
   * Registers the router's routes with a request and response.
   *
   * @param {http.IncomingMessage} request: The request object for creating routes.
   * @param {http.ServerResponse} response: The response object for creating routes.
   */
  registerRoutes: function (request, response) {
    route.setRequestAndResponse(request, response);
    this.css();
    this.js();
    this.calebImage();
    this.burdocImage();
  },

  /**
   * Writes the project's CSS to /css/main.css
   */
  css: function () {
    route.getCSS('/css/main.css', function () {
      var css = fs.readFileSync(`${__dirname}/views/css/bootstrap.min.css`);
      css += fs.readFileSync(`${__dirname}/views/css/main.css`);
      return css;
    });
  },

  /**
   * Writes the project's front-end JavaScript to /js/index.js
   */
  js: function () {
    route.getJavaScript('/js/index.js', function () {
      var js = fs.readFileSync(`${__dirname}/views/js/jquery-3.2.1.min.js`);
      js += fs.readFileSync(`${__dirname}/views/js/bootstrap.min.js`);
      js += fs.readFileSync(`${__dirname}/views/js/vue.min.js`);
      js += fs.readFileSync(`${__dirname}/views/components/burdoc-header.js`);
      js += fs.readFileSync(`${__dirname}/views/components/burdoc-form.js`);
      js += fs.readFileSync(`${__dirname}/views/components/burdoc-documents.js`);
      js += fs.readFileSync(`${__dirname}/views/js/index.js`);
      return js;
    });
  },

  /**
   * Writes the caleb.JPG image to /images/caleb.jpg
   */
  calebImage: function () {
    route.getImage('/images/caleb.jpg', 'jpeg', function () {
      return fs.readFileSync(`${__dirname}/views/images/caleb.JPG`);
    });
  },

  /**
   * Writes the burdoc.svg image to /images/burdoc.svg
   */
  burdocImage: function () {
    route.getImage('/images/burdoc.svg', 'svg+xml', function () {
      return fs.readFileSync(`${__dirname}/views/images/burdoc.svg`);
    });
  }
};
