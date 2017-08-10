const https = require('https');
const fs = require('fs');
const sockets = require('./sockets');
const router = require('./router');
const database = require('./database');
const user = require('./models/user');

const serverOptions = {
    key: fs.readFileSync(`${__dirname}/../secrets/key.pem`),
    cert: fs.readFileSync(`${__dirname}/../secrets/cert.pem`)
};

// Connect to the PostgreSQL database used to store users.
database.connect();

// Sync the user table in the PostgreSQL database.
user.sync();

// Create and start the server on port 8080.
const server = https.createServer(serverOptions, function (request, response) {
  router.registerRoutes(request, response);
}).listen(2368);

sockets.configure(server);

// Output that the server has started.
console.log('Running server on port 8080');
