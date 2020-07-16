
const net = require('net');
const http = require('http');
const config = require('./config').configuration;

const LOCAL_PORT = config.localport || 9000;
const REMOTE_PORT = config.remoteport || 80;
const LOCAL_HOST = config.localhost || '0.0.0.0';
const REMOTE_HOST = config.remotehost || 'www.google.com';

http.createServer(onRequest).listen(LOCAL_PORT, LOCAL_HOST);
console.log("Server listening "+LOCAL_HOST+":"+LOCAL_PORT+"...")

function log(data){
    var date_time = new Date("27 July 2016 13:30:00 GMT+05:45");
  
    //console.log('['+ date_time +'] ' + data.method + ' ' + data.url + 'Headers: \n' + data.headers + 'Body: \n' + data.body);
}


function onRequest(client_req, client_res) {
    log(client_req);
  
    var options = {
      hostname: REMOTE_HOST,
      port: REMOTE_PORT,
      path: client_req.url,
      method: client_req.method,
      headers: client_req.headers
    };
    console.log("Connecting to remote "+REMOTE_HOST+":"+REMOTE_PORT+"...")
    var proxy = http.request(options, function (res) {
      client_res.writeHead(res.statusCode, res.headers)
      res.pipe(client_res, {
        end: true
      });
    });
  
    client_req.pipe(proxy, {
      end: true
    });
            
    proxy.on('error', function(err) {
        client_res.writeHead(500)
        client_res.end('Unable to connect to remote server. ' + err.message)
    });
}
