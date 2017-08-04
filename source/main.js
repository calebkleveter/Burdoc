const http = require('http');
const router = require('./router');
const database = require('./database');
const user = require('./models/user');

database.connect();
user.sync();

http.createServer(function(request, response){
  router.registerRoutes(request, response);
}).listen(8080);

console.log("Running server on port 8080");
