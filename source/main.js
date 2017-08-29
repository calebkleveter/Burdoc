const https = require('https');
const fs = require('fs');
const sockets = require('./sockets');
const router = require('./router');
const database = require('./database');
const authentication = require('./authentication');
const user = require('./models/user');
const document = require('./models/document');

// Connect to the PostgreSQL database used to store users.
database.connect();

// Create a user table in the database if one does not exist yet.
user.sync();

// Create a document table in the database if one does not exist yet.
document.sync();

const certs = {
  key: fs.readFileSync(`${__dirname}/../secrets/server.key`),
  cert: fs.readFileSync(`${__dirname}/../secrets/server.crt`)
};

// Create and start the server on port 8080.
const server = https.createServer(certs, function (request, response) {

  // Configure authentication with the server.
  authentication.setRequestAndResponse(request, response);

  // Register all routes with the server
  router.registerRoutes(request, response);
}).listen(8080);

// Register the socket with the server instance.
sockets.configure(server);

// Output that the server has started.
console.log('Running server on port 8080');
