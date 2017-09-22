Vue.component('burdoc-documents', {
  template: `
  <div id="documents">
    <div v-if="documents.length > 0" class="docs-loop col-xs-12 col-sm-6 col-md-4 col-lg-3" v-for="document in documents">
      <div @click="redirect(document)" class="document">
        <div class="document-menu" @click="menu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <i class="fa fa-lg fa-ellipsis-h" aria-hidden="true"></i>
        </div>
        <ul class="dropdown-menu">
          <li>
            <a @click="rename(document)">Rename</a>
          </li>
          <li>
            <a @click="manageTags(document)">Manage Tags</a>
          </li>
          <li role="separator" class="divider"></li>
          <li>
            <a @click="destroy(document)">Delete</a>
          </li>
        </ul>
        <div class="identifier">
          <p>{{ document.titleCharacter }}</p>
        </div>
        <div class="title">
          <p>{{ document.title }}</p>
        </div>
      </div>
    </div>
    <div v-else>
      <p :class="messageClass">{{ noDocumentsMessage }}</p>
    </div>
    <burdoc-rename-doc-model></burdoc-rename-doc-model>
  </div>
  `,
  data: function () {
    return {
      documents: [],
      documentTags: {},
      messageClass: '',
      noDocumentsMessage: 'You Don\'t Have Any Documents',
      shouldRedirect: true
    };
  },
  methods: {
    redirect: function (doc) {
      if (this.shouldRedirect === true) {
        window.location.href = doc.url;
      } else {
        this.shouldRedirect = true;
      }
    },
    menu: function () {
      this.shouldRedirect = false;
    },
    rename: function (doc) {
      this.shouldRedirect = false;
      $('#rename-document').modal('show');
      Dispatch.$emit('rename-model-started', doc);
    },
    manageTags: function (doc) {
      this.shouldRedirect = false;
      $('#tag-manager-modal').modal('show');
      Dispatch.$emit('', this.documentTags[doc.id]);
    },
    destroy: function (doc) {
      this.shouldRedirect = false;
      bootbox.confirm({
        message: 'Are you sure you want to delete this document? This can not be reversed!',
        callback: (result) => {
          if (result) {
            socket.emit('deleteDocument', doc.id);
            socket.on('documentDeleted', function () {
              window.location.href = '/dashboard';
            });
            socket.on('deletionFailed', function (error) {
              bootbox.alert(error);
            });
          }
        }
      });
    }
  },
  created: function () {
    this.$http.post('/user-documents').then((response) => {
      this.documents = response.body;
    }).catch(function (error) {
      bootbox.alert(error.message);
    });
  }
});
