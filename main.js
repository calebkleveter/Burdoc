const http = require('http');

http.createServer(function(request, response){
  response.end('Hello World');
}).listen(8080);

console.log("Running server on port 8080");
