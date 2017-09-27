Vue.component('burdoc-tag-manager', {
  template: `
  <div class="tag-manager">
    <div class="modal fade" id="tag-manager-modal" tabindex="-1" role="dialog" aria-labelledby="tag-manager-modal-label">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title" id="tag-manager-modal-label">Tag Manager</h4>
          </div>
          <div class="modal-body">
            <div id="tags">
              <div class="tag btn btn-default" v-for="tag in tags">
                {{tag.name}}
                <span class="glyphicon glyphicon-remove" aria-hidden="true" @click="removeTag(tag)"></span>
              </div>
            </div>
            <div class="add-tag">
              <div class="input-group">
                <input type="text" class="form-control" placeholder="Tag Name" v-model="newTagName">
                <span class="input-group-btn">
                  <button class="btn btn-default" type="button" @click="createTag">Create</button>
                </span>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  `,
  data: function () {
    return {
      documentID: undefined,
      newTagName: '',
      tags: []
    };
  },
  methods: {
    removeTag: function (tag) {
      this.$http.post('/remove-document-tag', {
        documentID: this.documentID,
        tagID: tag.id
      }).then((response) => {
        var index = this.tags.indexOf(tag);
        this.tags.splice(index, 1);
      }).catch(function (error) {
        bootbox.alert(error.message);
      });
    },

    createTag: function () {
      if (this.newTagName !== '') {
        this.$http.post('/create-tag', {
          documentID: this.documentID,
          tagName: this.newTagName
        }).then((response) => {
          this.tags.push(response.body);
        }).catch(function (error) {
          bootbox.alert(error.message);
        });
        this.newTagName = '';
      } else {
        bootbox.alert('A name is needed to create a new tag!');
      }
    }
  },
  created: function () {
    Dispatch.$on('tag-manager-started', (data) => {
      this.documentID = data.documentID;
      this.tags = data.tags;
    });
  }
});
