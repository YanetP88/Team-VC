var http = require('http'),
	connect = require('connect'),
	rest = require('../rest.js'); //require('node-restfiy') shourld be used in your code

var app = connect()
	.use(rest());


http.createServer(app).listen(8080);	

resource('/rest', function() {
	get('/{name}', function(name) {
		return {msg: 'hello ' + name};
	});
});
