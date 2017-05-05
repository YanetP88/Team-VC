var http = require('http'),
	connect = require('connect'),
	morgan = require('morgan'),				
	bodyParser = require('body-parser'),		
	rest = require('../rest.js');  			// require('node-restify') should be ueesd in your code

var app = connect()
	.use(morgan())
	.use(bodyParser.json())
	.use('/rest',rest({
		logger:console, 
		mode: 'dev', 
		resourceLocation: './res', 
		scopes:['pathParams','query','body']
	}));
	
http.createServer(app).listen(8080);	
