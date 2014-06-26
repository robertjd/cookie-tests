var http = require('http');
var fs = require('fs');

var Cookies = require('cookies');
var open = require('open');
var uuid = require('node-uuid');

var IS_PRODUCTION = process.env.NODE_ENV==='production';


var PORT = process.env.PORT || 8001;

var SCHEME = process.env.SCHEME || 'http://';
var THIS_DOMAIN = process.env.THIS_DOMAIN || 'a.com';
var OTHER_DOMAIN = process.env.OTHER_DOMAIN || 'b.com';


var REDIRECT_COOKIE_KEY = 'redirect-cookie';
var AJAX_COOKIE_KEY = 'ajax-cookie';
var AJAX_URI = '/ajax';

function makeCookie(key,value,domain){
  return key + "="+value+"; Domain="+domain+"; Path=/; Expires=Wed, 13 Jan 2021 22:23:01 GMT; HttpOnly";
}

function startServer(){
  console.log('attempt to start server on port ' + PORT);
  http.createServer(function (req, res) {
    console.log(req.headers.host,req.method,req.headers['content-type'] || '',req.url);
    var cookies = new Cookies( req, res );
    if(req.url==='/redirect'){
      res.writeHead(302, {
        'Cache-Control': 'no-store',
        'Pragma': 'no-cache',
        'Location': SCHEME + OTHER_DOMAIN,
        'Set-Cookie': makeCookie(REDIRECT_COOKIE_KEY,uuid(),THIS_DOMAIN)
      });
      res.end();
    }else if(req.url===AJAX_URI){
      if(req.method==='OPTIONS'){
        res.writeHead(200, {
          'Cache-Control': 'no-store',
          'Pragma': 'no-cache',
          'Access-Control-Allow-Origin': SCHEME + OTHER_DOMAIN
        });
      }else{
        res.writeHead(200, {
          'Cache-Control': 'no-store',
          'Pragma': 'no-cache',
          'Access-Control-Allow-Origin': SCHEME + OTHER_DOMAIN,
          'Set-Cookie': makeCookie(AJAX_COOKIE_KEY,uuid(),THIS_DOMAIN)
        });
      }
      res.end();
    }else{
      res.writeHead(200, {
        'Cache-Control': 'no-store',
        'content-type': 'text/html',
        'Pragma': 'no-cache'
      });
      var page =
        fs.readFileSync('index.html','utf8')
          .replace(/REDIRECT_COOKIE/g,cookies.get(REDIRECT_COOKIE_KEY) || 'Not Found')
          .replace(/AJAX_COOKIE/g,cookies.get(AJAX_COOKIE_KEY) || 'Not Found')
          .replace(/THIS_DOMAIN/g,THIS_DOMAIN)
          .replace(/SCHEME/g,SCHEME)
          .replace(/AJAX_URI/g, IS_PRODUCTION ? AJAX_URI : (':'+PORT+AJAX_URI))
          .replace(/OTHER_DOMAIN/g,OTHER_DOMAIN);
      res.end(page);
    }
  }).listen(PORT,function(){
    if(!IS_PRODUCTION){
      open('http://'+THIS_DOMAIN+':'+PORT);
    }
  });

  console.log('Server running on port '+PORT+ ' in environment' + process.env.NODE_ENV);
}

startServer();