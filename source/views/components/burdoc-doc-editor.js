Vue.component('burdoc-doc-editor', {
  template: `
  <div id="editor" class="col-xs-12 col-sm-12">
    <div id="menu-bar">
      <div class="left">
        <ul class="menu-buttons">
          <li>
            <button type="button" class="btn btn-default" aria-label="Left Align" @keydown.ctrl.83.prevent="save" @click="save">
              <i class="fa fa-floppy-o" aria-hidden="true"></i>
            </button>
          </li>
        </ul>
      </div>
    </div>
    <div id="edit-tab" class="col-md-6">
      <textarea name="document-editor" id="document-editor" v-model="documentText" @keyup="render"></textarea>
    </div>
    <div id="preview-tab" class="col-md-6" v-html="html"></div>
    </div>
  </div>
  `,
  data: function () {
    return {
      documentText: '',
      html: ''
    };
  },
  methods: {
    render: function () {
      var converter = new showdown.Converter();
      this.html = converter.makeHtml(this.documentText);
    },
    
    save: function () { console.log('save') }
  }
});