const Vue = require('vue');
const BurdocHeader = require('./components/burdoc-header');
const BurdocForm = require('./components/burdoc-form');

new Vue({
  el: "#app",
  components: {
    burdoc-header: { BurdocHeader },
    burdoc-form: { BurdocForm }
  }
});
