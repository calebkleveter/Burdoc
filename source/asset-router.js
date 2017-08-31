const route = require('./routeBuilder');

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
    this.fontAwesome();
    this.bootstrapFont();
    this.calebImage();
    this.favicon();
    this.burdocImage();
  },

  /**
   * Writes the project's CSS to /css/main.css
   */
  css: function () {
    route.getCSS('/css/main.css', [
      'bootstrap.min',
      'font-awesome.min',
      'main'
    ]);
  },

  /**
   * Writes the project's front-end JavaScript to /js/index.js
   */
  js: function () {
    route.getJavaScript('/js/index.js', [
      'jquery-3.2.1.min',
      'bootstrap.min',
      'vue',
      'showdown.min',
      'bootbox.min',
      'jsPDF.min',
      'html2canvas',
      'html2pdf',
      'vue-resource',
      'burdoc-header',
      'burdoc-signup-form',
      'burdoc-login-form',
      'burdoc-new-doc-model',
      'burdoc-rename-doc-model',
      'burdoc-documents',
      'burdoc-doc-editor',
      'index'
    ]);
  },

  /**
   * Writes FontAwsome's fonts to /fonts/fontawesome-webfont.woff2?v=4.7.0
   */
  fontAwesome: function () {
    route.getFont('/fonts/fontawesome-webfont.woff2?v=4.7.0', 'woff2', 'fontawesome-webfont.woff2');
  },

  /**
   * Writes Bootstraps's fonts to /fonts/glyphicons-halflings-regular.woff2
   */
  bootstrapFont: function () {
    route.getFont('/fonts/glyphicons-halflings-regular.woff2', 'woff2', 'glyphicons-halflings-regular.woff2');
  },

  favicon: function () {
    route.getImage('/favicon.ico', 'x-icon', 'favicons/favicon.ico');
  },

  /**
   * Writes the caleb.JPG image to /images/caleb.jpg
   */
  calebImage: function () {
    route.getImage('/images/caleb.jpg', 'jpeg', 'caleb.JPG');
  },

  /**
   * Writes the burdoc.svg image to /images/burdoc.svg
   */
  burdocImage: function () {
    route.getImage('/images/burdoc.svg', 'svg+xml', 'burdoc.svg');
  }
};
