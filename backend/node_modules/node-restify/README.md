node-restify
============

A middleware of connect/express to support RESTFul style API service.

It route http request to special handler by request url patter, and binding path or query parameters to arguments of handler. It can support asynchronize response and compliance with 'Promise' result. It can also cooperate with other popular middleware like body-parser, cookie-parser ...


## Installation

This package is available on 'npm' as: `node-restify`

``` sh
npm install node-restify
```

## Usage

### Quick Start

```
var http = require('http'),
	connect = require('connect'),
	rest = require('node-restify'); 

var app = connect()
	.use(rest());


http.createServer(app).listen(8080);	

resource('/rest', function() {
	get('/{name}', function(name) {
		return {msg: 'hello ' + name};
	});
});
```
Access url http://localhost:8080/rest/node-restify from your brower, you can get return message
```
{"msg":"hello node-restify"}
```

### Configure Node-restify

The code of resources should be seperated from server.js or app.js, we can put them into the foldler resources and organize them to folder structure, like this:
```
-------node_modules
	|--server.js
	|--resources
		|--resource-a.js
		|--resource-b.js
		|--sub-folder
			|--resource-c.js
			|--resource-d.js
			...
```
The root folder name 'resources' is default location if your code like this:
```
...
	use(rest())
...
```
You can change it by pass a string to rest(), like this:
```
...
	use(rest(your_location))
...
```
You also can pass a config object to rest to get more control, like this:
```
...
	use(rest({
		mode: 'dev',  							//default is 'product'
		logger: console, 						//default log can not output anything
		scopes: ['pathParams','query','body'],  //default value is ['pathParams','query']		
		resourceLocation: your_location			//default value is 'resources'
	}))
...
```
'product' mode is default mode, in this mode all of resource will load at once when server start, your can change it to 'dev' mode which will cause reload all resource at every time node-restify receive a http request, in this case, you can change resource code on fly.

If your have favorite logger component like log4js, you can inject it to node-restify, you even can register a logger factory function. You can just inject 'console' object to node-restify, if you only need to know detail information when it work 

'scopes' used by parameter binding. You can change binding sequence or add new scope to it, for example, after use middleware 'body-parse', req.body can be accessed, 'body' can add in scopes. About more detail, see Handler, Arguments Binding section.

resourceLocation can specify the location of resource root folder, node-restify will scan this folder recursively.  

### Define Resource 
Resouce define is very simple, like this:
```
resource('/rest', function() {
	get('/node-restify/{name}',function(name) {
		return { msg: 'hello ' + name};
	});

	post('/{id}', function(id) {
		.....
	});

	...
});
```
You can put one resource in one resouce file, you also put all resources in one file, You even can nest resource like this:
```
resource('/catalog', function() {
	resource('/foo', function() {
		get('/bar', function() {
			...
		});
	});
	
	resource('/bar', function() {
		get('/bar', function() {
			...
		});
	});
});
```
The matched url are '/catalog/foo/bar' and '/catalog/bar/bar'.

'get','post','put','del' is global functions which add by node-restify, they used by register handler to HTTP Method 'GET', 'POST', 'PUT', 'DELETE'. If you need catch others HTTP Method, there is other method 'httpMethod(method)', you can ues it get new register function by pass method to it. Global function meansyou don't have to import anything, just use it, like 'describe','it' in test framework 'mocha'.

Path parameter can be specified when register resource by function 'resource' ,'get'..., like this:
```
resource('/{param1}', function() {
	get('/{param2}/{param3}',function(name) {
		return { msg: 'hello ' + name};
	});

	...
});
```
'{}' indicate parameter.

Any httpMethod can omit the path, just handler function, like this:
```
...
	get(function() {
		...
	});
...
```

### Handler function
Handler function will process http reqest, and return result to transform JSON format to client.
node-restify will binding argument and call handler when a http request matched a resource defination. Arguments will be binded by sequence which defined in config object. The result of handler SHOULD be object which can be serilized to string with JSON format. node-restify will put this result to http response body. In this case, 200 will be as http return code, and 'Content-Type':'application/json' will be set to response header.

```
...
	get('/foo', function(name, age, id ....) {
		....

		return {
			name: ...
			age: ...
			....
		};
	});

...
```
#### Arguments Binding
Arguments of handler can be binded by node-restify, let's take a example:
```
resource('/rest', function() {
	get('/foo/{name}', function(name, action) {
		...
	});
)};
```
When this resoure access by url: ..../rest/foo/node-restify?action=display, path parameter will be parsed first, we call this scope 'pathParams':
```
{
	name:'node-restify'
}
```
Then, query string will be parsed, and we call this scope 'query'
```
{
	action: 'display'
}
```
arguments of handler 'name','action' will be dinded values from these scopes following the sequence defined by config object (see Configure Node-restify section),in this case, 'name' will be binded the value 'node-restify' and 'action' will be binded the value 'display'.You can define any number of arguments with handler, they will be all binded value from these scope.

For a argument, if can not found value from first scope, node-restify will find next scope, until value be found or end of scope. In that case, undefinded will be bind to the argument.

You can add scope, for example, if middleware 'body-parser' be used, then request.body can be access which added by 'body-parser', you can add scope 'body' by set config object property 'scopes' (see Configure Node-restify). You alse can binding sequence of scopes.

#### Special Argument A: httpRequest
In some case, you need access http request directly,you just add a argument named 'httpRequest' to your handler, node-restify will bind http request to it for you,  for example, after use 'body-parser', you want get post body rathen othen use it as a binding scope, you can access it by 'httpRequest.body'.

#### Special Argument B: httpResponse
Like http request, http response will be auto-binding to argument 'httpResponse' if you declared it in you handler arguements. BUT, used it carefully, it will cause side effect, more detail, see 'Asynchronize Response'

#### Result and Error
The return value will be tranformed to JSON string and write back to response. If no result returned, or undifined returned by handler, 204 will be as http code returned to client by node-restify

500 will be return as http code to client, if any exception throw by handler. You can customize return code and message by throw your error by folowing format:
```
...
	get('/foo', function() {
		...
		throw {
			code:503,
			msg: '........'
		};
	}
...
```

### Asynchronize Response
Asynchronize is one of the most important feature of nodejs. It also be supported by node-restify. You can choose two way to implement it in node-restify.

#### Full control with httpResponse
You can get full control of http response by declare 'httpResponse' as argument of handler,if you like 'Callback Sytle'. In that case, node-restify just route http request to handler, can binding all of arguments, then just call handler, that's all. Nothiing will write back to client by node-restify, include http return code, header..., you must control reponse by yourself. like this:
```
...
	get(otherParameter1,otherParameter2, httpResponse) {
		...
		asyncCall(....,function(callbackResult) {
			httpResponse.writeHeader(200,......)
			.....
			httpResponse.write(......);
			httpResponse.end(....);
		});
	});
...
```

#### Promise Style Result
node-restify dose not depend any pormise package so far, but it support 'Promise style Result'. That means if a promise returned by handler, node-restify will receive result, and call 'then' function to get real date and format to JSON string back to client, as same, fail will be called if any exception happend. 'Promise style Result' is just a object which have function 'then', and 'fail', so it is easy to get by many popular promise libs, like 'Q', 'promise', sample code is:
```
...
resource('/rest', function() {
	get(function() {
		var deferred = Q.defer();
		someAsyncCall(function(callbackResult){
			return deferred.resolve({msg:callbackResult});
		});
		return deferred.promise;
	});
});
...
```

## Example

### Simple Server
```
var http = require('http'),
	connect = require('connect'),
	rest = require('../rest.js'); //require('node-restfiy') shourld be used in your code

var app = connect()
	.use(rest());


http.createServer(app).listen(8080);	

// accessed by url: http://localhost:8080/rest/node-restify GET
resource('/rest', function() {
	get('/{name}', function(name) {
		return {msg: 'hello ' + name};
	});
});
```

### Server
```
var http = require('http'),
	connect = require('connect'),
	morgan = require('morgan'),
	rest = require('../rest.js');  // require('node-restify') should be ueesd in your code

var app = connect()
	.use(morgan())
	.use('/rest',rest({logger:console, mode: 'dev'}));
	
http.createServer(app).listen(8080);
```

```
resource('/foo',function() {
	//accessed by http://localhost:8080/rest/foo GET
	get(function() {
		return {msg:'GET /foo'};
	});

	//accessed by http://localhost:8080/rest/foo/bar GET
	get('/bar',function() {
		return {msg:'GET /foo/bar'};
	});

	
	//accessed by http://localhost:8080/rest/foo/bar/123 GET
	get('/bar/{id}', function(id) {
		return {id:id};
	});
	
	//accessed by http://localhost:8080/rest/foo/bar-query/123?type=test&name=node GET
	get('/bar-query/{id}', function(id, type, name) {
		return {
			id:	id,
			type: type,
			name: name
		};
	});

	//accessed by http://localhost:8080/rest/foo/bar POST 
	post('/bar', function() {
		return {msg:'POST /foo/bar'};
	});

	//accessed by http://localhost:8080/rest/foo/12345 PUT
	put('/{id}',function(id) {
		return {id:id};
	});

	//accessed by http://localhost:8080/rest/foo/order/hard DELETE 
	del('/{name}/{type}', function(name, type) {
		return {
			action:'delete',
			name: name,
			type: type,
		}
	});
```	
### Advance Server
```
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
```

```
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
```
All sample code can be found in directory 'example'.
All test case can be found in directory 'test' (mocha need be install before run test case)

##License
`node-restify` is licensed under the MIT License.


