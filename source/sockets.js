const socketio = require('socket.io');
const showdown = require('showdown');
const authentication = require('./authentication');
const user = require('./models/user');
const document = require('./models/document');

/**
 * The socket connecting the client and server.
 */
var _socket;

/**
 * Creates the socket and registers it and it's events with the server.
 * 
 * @param {http.ClientRequest} server: The server the socket should be connected to.
 */
function configure (server) {
  const io = socketio(server);

  io.on('connection', function (socket) {
    console.log('Socket connected');
    _socket = socket;
    receiverEvents.registerWithSocket(socket);
  });
}

/**
 * Handles the socket events received from the client.
 */
var receiverEvents = {

  /**
   * Sets the socket the receiver event functions will connect to and registers the events with it.
   * 
   * @param {socketio.Socket} socket: The socket the events will be handled on.
   */
  registerWithSocket: function (socket) {
    this.socket = socket;
    this.createDocument();
    this.saveDocument();
    this.fetchDocumentData();
    this.renameDocument();
    this.deleteDocument();
  },

  // MARK: - DOCUMENTS

  /**
   * Attempts to create a new document for the current user.
   */
  createDocument: function () {
    this.socket.on('createDocument', (data) => {
      user.fetchByName(authentication.currentUser).then((user) => {
        return document.create(user.id, data.name, '');
      }).then((userModel) => {
        this.socket.emit('documentCreated', {url: `document/${authentication.currentUser}/${userModel.url}`});
      }).catch((error) => {
        this.socket.emit('documentCreationError', error.message);
      });
    });
  },

  /**
   * Saves new contents for a document.
   */
  saveDocument: function () {
    this.socket.on('saveDocument', (data) => {
      var model;
      user.fetchByName(data.documentOwner).then((userModel) => {
        model = userModel;
        return document.findByURLAndUserID(data.documentURL, model.id);
      }).then((doc) => {
        return document.updateContentsForNameAndUserID(data.contents, doc.name, model.id);
      }).then(() => {
        this.socket.emit('documentSaved');
      }).catch((error) => {
        this.socket.emit('saveFailed', error.message);
      });
    });
  },

  /**
   * Sends the markdown and rendered markdown to the editor.
   */
  fetchDocumentData: function () {
    this.socket.on('fetchDocument', (data) => {
      var model;
      user.fetchByName(data.documentOwner).then((userModel) => {
        model = userModel;
        return document.findByURLAndUserID(data.documentURL, model.id);
      }).then((doc) => {
        var markdownConverter = new showdown.Converter();
        var markdown = doc.contents;
        var html = markdownConverter.makeHtml(markdown);
        this.socket.emit('documentFetched', {
          markdown: markdown,
          html: html
        });
      }).catch((error) => {
        this.socket.emit('fetchFailed', error.message);
      });
    });
  },

  /**
   * Assigns a new name to a document.
   */
  renameDocument: function () {
    this.socket.on('renameDocument', (data) => {
      document.updateNameWithID(data.name, data.id).then(() => {
        this.socket.emit('documentRenamed');
      }).catch((error) => {
        this.socket.emit('documentRenamingError', error.message);
      });
    });
  },

  /**
   * Deletes a document.
   */
  deleteDocument: function () {
    this.socket.on('deleteDocument', (id) => {
      document.deleteWithID(id).then(() => {
        this.socket.emit('documentDeleted');
      }).catch((error) => {
        this.socket.emit('deletionFailed', error.message);
      });
    });
  }
};

module.exports.configure = configure;
