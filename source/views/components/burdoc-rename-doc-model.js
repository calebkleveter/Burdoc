Vue.component('burdoc-rename-doc-model', {
  template: `
  <div class="rename-doc">
    <div class="modal fade" id="rename-document" tabindex="-1" role="dialog" aria-labelledby="renameDocument">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title" id="newDocument">Rename a Document</h4>
          </div>
          <div class="modal-body">
            <div v-if='isSubmitting' class="loading-indicator">
              <i class="fa fa-cog fa-5x fa-spin" aria-hidden="true"></i>
            </div>
            <div v-else class="form-group">
              <label for="document-name">Name:</label>
              <input type="text" name="document-name" v-model='documentName' class="form-control" id="document-name" placeholder="Document Name">
            </div>
            <div v-if='error' class="error-message">
              <p>{{ error }}</p>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary" @click="renameDocument">Rename Document</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  `,
  data: function () {
    return {
      documentName: '',
      isSubmitting: false,
      error: ''
    };
  },
  methods: {
    renameDocument: function () {
      this.isSubmitting = true;
      this.error = '';
      if (this.documentName !== '') {
        socket.emit('renameDocument', {name: this.documentName});
        socket.on('documentRenamed', function (data) {
          window.location.href = data.url;
        });
        socket.on('documentRenamingError', function (errorMessage) {
          this.isSubmitting = false;
          this.error = errorMessage;
        });
      } else {
        this.isSubmitting = false;
        this.error = 'Pick what you renaming your document to!';
      }
    }
  }
});
