resource('/other', function(){
	// accessed by http://localhost:8080/rest/other GET
	get( function() {
		return {msg: 'I am in a sub folder'};
	});
});
