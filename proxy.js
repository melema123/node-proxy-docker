
const net = require('net');
const http = require('http');
const config = require('./config').configuration;

const LOCAL_PORT = config.localport || 9000;
const REMOTE_PORT = config.remoteport || 80;
const LOCAL_HOST = config.localhost || '0.0.0.0';
const REMOTE_HOST = config.remotehost || 'www.google.com';

http.createServer(callback).listen(LOCAL_PORT, LOCAL_HOST);
console.log(`Server listening ${LOCAL_HOST}:${LOCAL_PORT}...`);

function callback(req, client_res) {
    var body = ''
    req.on('data', function(data) {
        body = data + body;
      });
      req.on('end', function() {
        log(req, body);
      });
  
    var options = {
      hostname: REMOTE_HOST,
      port: REMOTE_PORT,
      path: req.url,
      method: req.method,
      headers: req.headers
    };

    console.log(`${new Date()} Sent to remote: ${REMOTE_HOST} ${REMOTE_PORT}`)
    var proxy = http.request(options, function (res) {
      body = ""
      client_res.writeHead(res.statusCode, res.headers)
      res.on('data', function(data) {
        body = data + body;
      });
      res.on('end', function() {
        console.log(`${new Date()} Received from remote: ${REMOTE_HOST} ${REMOTE_PORT}`)
        log(res, body);
      });
      res.pipe(client_res, {
        end: true
      });
    });
  
    req.pipe(proxy, {
      end: true
    });
            
    proxy.on('error', function(err) {
        client_res.writeHead(500)
        client_res.end('Failed to connect to remote server: '+REMOTE_HOST+":"+REMOTE_PORT + " Error: " + err.message)
    });
}

function log(data, body){
  console.log(data.statusCode || `${data.method} ${data.url}`)
  var headers = data.headers;
  for (var key in headers) {
    console.log(key + ": "+ headers[key]);
  }
    console.log('\n'+body);
}