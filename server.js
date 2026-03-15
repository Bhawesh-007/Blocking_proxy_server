//now here i will create a proxy server using express and http-proxy-middleware
//its role will be to forward request to the proxy server which will further check website is blocked or not
const express = require('express');
const app = express();
