# Cookie Tests

A simple server and web app that demonstrates:

* Setting a cookie on a 302 redirect

* Setting a cookie on a same-domain ajax request

* Setting a cookie on a cross-domain request, using the "credentials" option.

### Online demo

Live demo here: http://cookie-a.herokuapp.com

### Run the demo yourself.

You'll want to start two instances of the node server, one for each domain.
When you start the server, it will open the demo web app in your browser.
Example commands:

Start server for domain A:

> THIS_DOMAIN=http://a.com:8001 OTHER_DOMAIN=http://b.com:8002 node server.js

Start server for domain B:

> THIS_DOMAIN=http://b.com:8002 OTHER_DOMAIN=http://a.com:8001 node server.js

### Some background reading:

https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS

http://blogs.msdn.com/b/ieinternals/archive/2010/05/13/xdomainrequest-restrictions-limitations-and-workarounds.aspx