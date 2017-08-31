Vue.component('burdoc-doc-editor', {
  template: `
  <div id="editor" class="col-xs-12 col-sm-12">
    <div id="menu-bar">
      <div class="left">
        <ul class="menu-buttons">
          <li>
            <button type="button" class="btn btn-default" aria-label="Left Align" :style="saveButtonStyle" @keydown.ctrl.83.prevent="save" @click="save">
              <i class="fa fa-floppy-o" aria-hidden="true"></i>
            </button>
          </li>
          <li>
            <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" aria-label="Left Align">
              <i class="fa fa-download" aria-hidden="true"></i>
            </button>
            <ul class="dropdown-menu">
              <li><a @click="downloadMarkdown">Markdown</a></li>
              <li><a @click="downloadHTML">HTML</a></li>
              <li><a @click="downloadPDF">PDF</a></li>
            </ul>
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
      html: '',
      saveButtonStyle: ''
    };
  },
  methods: {
    render: function () {
      this.saveButtonStyle = 'background-color: rgb(218, 208, 120)';
      var converter = new showdown.Converter();
      this.html = converter.makeHtml(this.documentText);
    },

    save: function () {
      var documentData = window.location.pathname.split('/');
      socket.emit('saveDocument', {
        contents: this.documentText,
        documentOwner: documentData[2],
        documentURL: documentData[3]
      });
      socket.on('documentSaved', () => {
        this.saveButtonStyle = '';
      });
      socket.on('saveFailed', function (error) {
        bootbox.alert(error);
      });
    },

    downloadPDF: function () {
      var element = document.getElementById('preview-tab');
      html2pdf(element, {
        filename: `${window.location.href.split('/')[5]}.pdf`
      });
    },

    downloadHTML: function () {
      var fileName = window.location.href.split('/')[5];
      this.download(this.html, `${fileName}.html`, 'html');
    },

    downloadMarkdown: function () {
      var fileName = window.location.href.split('/')[5];
      this.download(this.documentText, `${fileName}.md`, 'plain');
    },

    // Thanks to NatureShade for his/her answer here: https://stackoverflow.com/questions/609530/download-textarea-contents-as-a-file-using-only-javascript-no-server-side#19332584
    download: function (text, filename, texttype) {
      var textFileAsBlob = new Blob([text], {type: `text/${texttype}`});
      var downloadLink = document.createElement('a');
      downloadLink.download = filename;
      downloadLink.innerHTML = 'Download File';
      if (window.webkitURL != null) {
        // Chrome allows the link to be clicked
        // without actually adding it to the DOM.
        downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
      } else {
        // Firefox requires the link to be added to the DOM
        // before it can be clicked.
        downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
        downloadLink.onclick = destroyClickedElement;
        downloadLink.style.display = 'none';
        document.body.appendChild(downloadLink);
      }
      downloadLink.click();
    }
  },
  created: function () {
    var documentData = window.location.pathname.split('/');
    socket.emit('fetchDocument', {
      documentOwner: documentData[2],
      documentURL: documentData[3]
    });
    socket.on('documentFetched', (data) => {
      this.documentText = data.markdown;
      this.html = data.html;
    });
    socket.on('fetchFailed', (error) => {
      bootbox.alert(error);
    });
  }
});
