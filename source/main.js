import http from 'http';
import sockets from './sockets';
import database from './database';
import authentication from './authentication';
import user from './models/user';
import document from './models/document';
import tag from './models/tags';
import documentTag from './models/document-tag';
import router from './router';

// Connect to the PostgreSQL database used to store users.
database.connect();

// Create database tables if they don't exist yet.
user.sync();
document.sync();
tag.sync();
documentTag.sync();

// Create and start the server on port 8080.
const server = http.createServer(function (request, response) {
  // Configure authentication with the server.
  authentication.setRequestAndResponse(request, response);

  // Register all API routes with the server.
  router.registerRoutes(request, response);
}).listen(8080);

// Register the socket with the server instance.
sockets.configure(server);

// Output that the server has started.
console.log('Running server on port 8080');
