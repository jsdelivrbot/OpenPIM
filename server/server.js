var path = require('path');
var http = require('http');
var express = require('express');
var app = express();
var server = http.createServer(app);

function normalizePort(val) {
  var port = parseInt(val, 10);
  if(isNaN(port)) return val;
  if(port >= 0) return port;
  return false;
}

app.use(express.static(path.join(__dirname, '../public')));

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

server.listen(port, '0.0.0.0', function() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  console.log('Listening on ' + bind);
});
