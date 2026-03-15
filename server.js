//now here i will create a proxy server using express and http-proxy-middleware
//its role will be to forward request to the proxy server which will further check website is blocked or not
const express = require('express');
const http = require('http');
const net = require('net');
const httpProxy = require('http-proxy');
const {handleHttpRequest , isBliocked} = require('./utils');

const server = http.createServer(handleHttpRequest);

server.on('Connect',(req , clientSocket, head) => {
    const [host , port] = req.url.split(':');
    if(isBliocked(host)){
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
    server.listen(8080,()=>{
    console.log('Proxy server is running on port 8080');
    })

})

// Handle HTTP requests
