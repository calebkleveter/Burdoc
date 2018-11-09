const http = require('http');
const fs = require('fs');
const sockets = require('./sockets');
const database = require('./database');
const authentication = require('./authentication');
const user = require('./models/user');
const document = require('./models/document');
const tag = require('./models/tags');
const documentTag = require('./models/document-tag');

import router from './router'

// Connect to the PostgreSQL database used to store users.
database.connect();

// Create a user table in the database if one does not exist yet.
user.sync();

// Create a document table in the database if one does not exist yet.
document.sync();

// Create and start the server on port 8080.
const server = http.createServer(function (request, response) {

  // Configure authentication with the server.
  authentication.setRequestAndResponse(request, response);

  // Register all web routes with the server.
  webRouter.registerRoutes(request, response);

  // Register all API routes with the server.
  apiRouter.registerRoutes();
}).listen(8080);

// Register the socket with the server instance.
sockets.configure(server);

// Output that the server has started.
console.log('Running server on port 8080');
