var Q = require('q');
var fs = require('fs');
var util = require('util');

resource('/adv', function() {
	// arguments binding by scope sequence
	// accessed by http://localhost:8080/rest/adv/foo/bar?name=peter&action=query
	// POST body: {"name":"body","action":"post","type":"override"}
	// HTTP header: application/json
	post('/foo/{name}', function(name, action, type) {
		return {
			name: name,
			action: action,
			type: type
		};
	});

	// binding http request special name 'httpRequest'
	// accessed by http://localhost:8080/rest/adv/body
	// POST body: {"name":"body","action":"post","type":"override"}
	// HTTP header: application/json
	post('/body',function(httpRequest) {
		var body = httpRequest.body;
		return body;
	});

	//async call by callback style
	get('/callback', function(httpResponse) {
		fs.readdir('.', function(err, files) {
			if(err) { 
				httpResponse.writeHead(500,{'Content-Type':'application/json'});
				httpResponse.end(JSON.stringify(util.inspect(err)));
			}
			httpResponse.writeHead(200,{'Content-Type':'application/json'});
			httpResponse.end(JSON.stringify(util.inspect(files)));

		});

	});

	//async call by promise style
	get('/promise',function() {
		return Q.nfcall(fs.readdir,'.');
	});

});
