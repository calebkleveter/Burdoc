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
            <button type="button" class="btn btn-primary" @click="createDocument">Create Document</button>
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
    createDocument: function () {
      this.isSubmitting = true;
      this.error = '';

      this.$http.post('/create-document', {
        name: this.documentName
      }).then((response) => {
        if (response.body.error) {
          this.isSubmitting = false;
          bootbox.alert(response.body.error);
        } else {
          window.location.href = response.body.url;
        }
      }).catch(function (error) {
        this.isSubmitting = false;
        bootbox.alert(error.message);
      });
    }
  }
});
