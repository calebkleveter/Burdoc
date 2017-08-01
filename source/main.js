const http = require('http');
const router = require('./router');

http.createServer(function(request, response){
  router.registerRoutes(request, response);
}).listen(8080);

console.log("Running server on port 8080");
