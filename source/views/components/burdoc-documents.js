Vue.component('burdoc-documents', {
  template: `
  <div id="documents">
    <div v-if="documents.length > 0" class="docs-loop col-xs-12 col-sm-6 col-md-4 col-lg-3" v-for="document in documents">
      <div @click="redirect(document)" class="document">
        <div class="document-menu">
          <i class="fa fa-lg fa-ellipsis-h" aria-hidden="true"></i>
        </div>
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
  </div>
  `,
  data: function () {
    return {
      documents: [],
      messageClass: '',
      noDocumentsMessage: 'You Don\'t Have Any Documents'
    };
  },
  methods: {
    redirect: (doc) => {
      window.location.href = doc.url;
    }
  },
  created: function () {
    socket.emit('getUserDocuments');
    socket.on('documentsFetched', (docs) => {
      this.documents = docs;
    });
    socket.on('documentFetchFailed', (error) => {
      this.messageClass = 'error-message';
      this.noDocumentsMessage = error;
    });
  }
});
