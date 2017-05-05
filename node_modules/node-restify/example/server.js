var http = require('http'),
	connect = require('connect'),
	morgan = require('morgan'),
	rest = require('../rest.js');  // require('node-restify') should be ueesd in your code

var app = connect()
	.use(morgan())
	.use('/rest',rest({logger:console, mode: 'dev'}));
	
http.createServer(app).listen(8080);	
