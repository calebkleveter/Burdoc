const http = require('http');
const router = require('./router');
const database = require('./database');
const user = require('./models/user');

// Connect to the PostgreSQL database used to store users.
database.connect();

// Sync the user table in the PostgreSQL database.
user.sync();

// Create and start the server on port 8080.
http.createServer(function(request, response){
  router.registerRoutes(request, response);
}).listen(8080);

// Output that the server has started.
console.log("Running server on port 8080");
