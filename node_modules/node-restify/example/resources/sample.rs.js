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
});
