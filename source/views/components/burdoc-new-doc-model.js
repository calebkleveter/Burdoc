Vue.component('burdoc-new-doc-model', {
  template: `
  <div class="new-doc">
    <button type="button" class="btn btn-default" aria-label="Left Align" data-toggle="modal" data-target="#new-document">
      <i class="fa fa-plus" aria-hidden="true"></i>
    </button>
    <div class="modal fade" id="new-document" tabindex="-1" role="dialog" aria-labelledby="newDocument">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title" id="newDocument">Create a New Document</h4>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label for="document-name">Name:</label>
              <input type="text" name="document-name" v-model='documentName' class="form-control" id="document-name" placeholder="Document Name">
            </div>
            <div v-if='error'>
              <p>{{ error }}</p>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary" @onclick="createDocument">Create Document</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  `,
  data: function () {
    return {
      documentName: '',
      error: ''
    };
  },
  methods: {
    createDocument: function () {
      if (this.documentName != nil) {
        socket.emit('createDocument', {name: this.documentName});
        socket.on('documentCreated', function (data) {
          window.location.href = data.url;
        });
        socket.on('documentCreationError', function (errorMessage) {
          this.error = errorMessage;
        });
      } else {
        this.error = 'Pick a name for your new document!';
      }
    }
  }
});