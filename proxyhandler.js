//now this is simply the logic part which decides which will be blocked and which will be allowed
const httpProxy = require("http-proxy");
const proxy  = httpProxy.createProxyServer({});
const BlockedDomains = [ "dfa","dfaf","dfadf"];
function isBlocked(url){
    return BlockedDomains.filter((items)=>(items===url));
}
function handleHttpRequest(req,res){
    const host = req.headers.host;
    if(isBlocked(host)){
        return   // web-page to render
    }
    //now what i have to do is that i have to make req to the targeted website using proxy server so below will do that only
    proxy.web(req,res,{
        target: "http://" + host,
        changeOrigin: true,
    })

}
module.exports = {isBlocked , handleHttpRequest};