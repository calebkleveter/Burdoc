import Vue from './vue.js';
import BurdocHeader from '../../views/components/burdoc-header.vue';
import BurdocRenameDocModel from '../../views/components/burdoc-rename-doc-model.vue';
import BurdocNewDocModel from '../../views/components/burdoc-new-doc-model.vue';
import BurdocLoginForm from '../../views/components/burdoc-login-form.vue'

new Vue({
  el: "#app",
  components: { BurdocHeader, BurdocRenameDocModel, BurdocNewDocModel, BurdocLoginForm }
});
