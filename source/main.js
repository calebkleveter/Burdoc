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

// Sync the user table in the PostgreSQL database.
user.sync();

// Created a document table in the database if one does not exist yet.
document.sync();

const certs = {
  key: fs.readFileSync(`${__dirname}/../secrets/server.key`),
  cert: fs.readFileSync(`${__dirname}/../secrets/server.crt`)
};

// Create and start the server on port 8080.
const server = https.createServer(certs, function (request, response) {
  authentication.setRequestAndResponse(request, response);
  router.registerRoutes(request, response);
}).listen(8080);

sockets.configure(server);

// Output that the server has started.
console.log('Running server on port 8080');
