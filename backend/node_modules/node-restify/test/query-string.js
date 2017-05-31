var rest = require('../rest')({mode:'test'}),
	mockRes = require('./resHelper').mockResponse,
	mockUNext = require('./resHelper').mockUNext,
	mockNext = require('./resHelper').mockNext,
	assert = require('assert');

debugger;
describe('query string', function() {
	beforeEach(function() {
		rest.clear();
	});

	it('happy path', function() {
		resource('/rest', function() {
			get(function(name, age) {
				return {
					name: name,
					age: age
				};
			});
		});

		var res = mockRes(),
			req = {
				url: '/rest?name=peter&age=100',
				method: 'GET'
			};

		rest(req, res, mockUNext);
		
		assert.equal(res.code, 200);
		assert.deepEqual(JSON.parse(res.body),{name:'peter',age:'100'});
	});

	it('duplicate query parameter', function() {
		resource('/rest', function() {
			get(function(name) {
				return {
					name: name
				};
			});
		});

		var res = mockRes(),
			req = {
				url: '/rest?name=peter&name=shenyu',
				method: 'GET'
			};

		rest(req, res, mockUNext);
		
		assert.equal(res.code, 200);
		assert.deepEqual(JSON.parse(res.body),{name:['peter','shenyu']});
	});

	it('work together with pathParameter', function() {
		resource('/rest', function() {
			get('/{id}', function(id, name, age) {
				return {
					id: id,
					name: name,
					age: age
				};
			});
		});

		var res = mockRes(),
			req = {
				url: '/rest/123456?name=peter&age=100',
				method: 'GET'
			};

		rest(req, res, mockUNext);
		
		assert.equal(res.code, 200);
		assert.deepEqual(JSON.parse(res.body),{name:'peter',id:'123456',age:'100'});
	});

	it('duplicate parameter name with pathParameter', function() {
		resource('/rest', function() {
			get('/{id}', function(id, name, age) {
				return {
					id: id,
					name: name,
					age: age
				};
			});
		});

		var res = mockRes(),
			req = {
				url: '/rest/123456?id=234&name=peter&age=100',
				method: 'GET'
			};

		rest(req, res, mockUNext);
		
		assert.equal(res.code, 200);
		assert.deepEqual(JSON.parse(res.body),{name:'peter',id:'123456',age:'100'});
	});
});
