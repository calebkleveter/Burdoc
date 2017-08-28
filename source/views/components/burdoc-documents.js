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
    }
  },
  created: function () {
    socket.emit('getUserDocuments');
    socket.on('documentsFetched', (docs) => {
      this.documents = docs;

      // HACK: For some reason you have to call this function, otherwise, if you try to select a document without selecting a document menu first, you won't be directed to the editor.
      this.redirect();
      $('#rename-document').modal({show: false});
    });
    socket.on('documentFetchFailed', (error) => {
      this.messageClass = 'error-message';
      this.noDocumentsMessage = error;
    });
  }
});
