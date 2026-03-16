const httpProxy = require("http-proxy");
const proxy = httpProxy.createProxyServer({});

const BlockedDomains = ["youtube.com" , "instagram.com"];

function isBlocked(host){
    if(!host) return false;
    return BlockedDomains.some(d => host.includes(d));
}

function handleHttpRequest(req, res){

    const host = req.headers.host;

    console.log("HTTP:", req.url, host);

    if(isBlocked(host)){
        res.writeHead(403, {"Content-Type":"text/plain"});
        res.end("Access Denied");
        return;
    }

    // const target = "http://" + host;

    proxy.web(req,res,{
        target: req.url,
        changeOrigin: true
    },(err)=>{
        console.error("Proxy error:",err);
        res.writeHead(500);
        res.end("Proxy Error");
    });
}

module.exports = {handleHttpRequest, isBlocked};