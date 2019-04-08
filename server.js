/*const port = 3001;
const express = require('express')
const app = express()
var bodyParser = require('body-parser')
//Attach the middleware
app.use( bodyParser.json() );

app.post('/enrol', async function(request, response){
  var query1 = request.query.param1;
  var query2 = request.query.param2;

  console.log("Param1: ", query1);
  console.log("Param2: ", query2);
  const enrol = require('./enrolUser').enrolUser;
  try{
    let abc = await enrol(query1, query2);
    console.log(abc);

  }catch(err) {
    console.log("in error handler")
    response.sendStatus(500).json({error: err.toString()});
  };  
  response.sendStatus(200);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))*/

var WebSocketServer = require('websocket').server;
var http = require('http');
 
var server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});
server.listen(8081, function() {
    console.log((new Date()) + ' Server is listening on port 8080');
});
 
wsServer = new WebSocketServer({
    httpServer: server,
    // You should not use autoAcceptConnections for production
    // applications, as it defeats all standard cross-origin protection
    // facilities built into the protocol and the browser.  You should
    // *always* verify the connection's origin and decide whether or not
    // to accept it.
    autoAcceptConnections: false
});
 
function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed.
  return true;
}
 
wsServer.on('request', function(request) {
    if (!originIsAllowed(request.origin)) {
      // Make sure we only accept requests from an allowed origin
      request.reject();
      console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
      return;
    }
    
    var connection = request.accept('ws-protocol', request.origin);
    console.log((new Date()) + ' Connection accepted.');
    connection.on('message', async function(message) {
        if (message.type === 'utf8') {
            console.log('Received Message: ' + message.utf8Data);
            const messageJson = JSON.parse(message.utf8Data);
            if(messageJson.messageType === 'register') {
              const username = messageJson.data.username;
              const password = messageJson.data.password;
              console.log('registering: ', username, ', ', password);
              const enrol = require('./enrolUser').enrolUser;
              try{
                let abc = await enrol(username, password);
                console.log(abc);

              } catch(err){
                console.log('in error handler');
              }
            }
            //connection.sendUTF(message.utf8Data);
        }
        else if (message.type === 'binary') {
            console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
            connection.sendBytes(message.binaryData);
        }
    });
    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});