//now here i will create a proxy server using express and http-proxy-middleware
//its role will be to forward request to the proxy server which will further check website is blocked or not
const http = require('http');
const net = require('net');
const {handleHttpRequest , isBlocked} = require('./proxyhandler.js');

const server = http.createServer(handleHttpRequest);
process.on("uncaughtException", (err) => {
    console.log("Uncaught Exception:", err.message);
});

process.on("unhandledRejection", (err) => {
    console.log("Unhandled Rejection:", err);
});

server.on('connect',(req , clientSocket, head) => {
    console.log("HTTPS REQUEST:", req.url);
    const [host , port] = req.url.split(':');
    if(isBlocked(host)){
        clientSocket.write('HTTP/1.1 403 Forbidden\r\n\r\n');
        clientSocket.end();
        return;
    }
    //if it is not blocked then i will just careate a TCP connection to target server and pipe data between servier and client
    
    const serverSocket = net.connect(port, host,()=>{
         clientSocket.write('HTTP/1.1 200 Connection Established\r\n\r\n');
         serverSocket.write(head);
         clientSocket.pipe(serverSocket);
         serverSocket.pipe(clientSocket);//this will create a TCP connection between client and server and data will be piped between them


    })
   

})
 server.listen(8007,()=>{
    console.log('Proxy server is running on port 8005');
    })
   

// Handle HTTP requests
