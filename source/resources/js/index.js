import Vue from './vue.js';
import BurdocHeader from '../../views/components/burdoc-header.vue';
import BurdocRenameDocModel from '../../views/components/burdoc-rename-doc-model.vue';

new Vue({
  el: "#app",
  components: { BurdocHeader, BurdocRenameDocModel }
});
