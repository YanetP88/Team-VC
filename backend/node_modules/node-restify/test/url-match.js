var rest = require('../rest')({mode:'test'}),
	mockRes = require('./resHelper').mockResponse,
	mockUNext = require('./resHelper').mockUNext,
	mockNext = require('./resHelper').mockNext,
	assert = require('assert');

debugger;
describe('url match', function() {
	beforeEach(function() {
		rest.clear();
	});

	it('happy path', function() {
		resource('/rest',function(){
			get('/hello', function() {
				return {message:'hello'};
			});
		});
		var res = mockRes(),
			req = {
				url : '/rest/hello',
				method: 'GET'
			};
		
		rest(req, res, mockUNext);
		assert.equal(res.code, 200);
		assert.deepEqual(res.head, {'Content-Type':'application/json'});
		assert.deepEqual(res.body, JSON.stringify({message:'hello'}));
	});

	it('unmatch any url', function() {
		resource('/rest',function(){
			get('/hello', function() {
				return {message:'hello'};
			});
		});
		var res = mockRes(),
			req = {
				url : '/unmatch',
				method: 'GET'
			};
		
		rest(req, res, mockNext);
		assert.equal(mockNext.result(),true);
	});

	it('http method get, put, post, delete', function(){
		resource('/rest',function(){
			get('/hello', function() {
				return {method:'get'};
			});
			post('/hello', function() {
				return {method:'post'};
			});
			put('/hello', function() {
				return {method:'put'};
			});
			del('/hello', function() {
				return {method:'delete'};
			});
		});

		var res = mockRes(),
			req = {
				url : '/rest/hello',
				method: 'GET'
			};
		rest(req, res, mockNext);
		assert.equal(JSON.parse(res.body).method, 'get');

		
		res = mockRes(),
		req = {
				url : '/rest/hello',
				method: 'PUT'
			};
		rest(req, res, mockNext);
		assert.equal(JSON.parse(res.body).method, 'put');

		res = mockRes(),
		req = {
				url : '/rest/hello',
				method: 'POST'
			};
		rest(req, res, mockUNext);
		assert.equal(JSON.parse(res.body).method, 'post');

		res = mockRes(),
		req = {
				url : '/rest/hello',
				method: 'DELETE'
			};
		rest(req, res, mockUNext);
		assert.equal(JSON.parse(res.body).method, 'delete');
	});

	it('same method, different url pattern', function() {
		resource('/rest', function() {
			get('/abc', function() {
				return {url:'abc'};
			});
			get('/xyz', function() {
				return {url:'xyz'};
			});
		});

		var res = mockRes(),
			req = {
				url: '/rest/abc',
				method: 'GET'
			};
		rest(req, res, function() { assert.fail('next should not be called'); });
		assert.equal(JSON.parse(res.body).url, 'abc');

		res = mockRes(),
		req = {
			url: '/rest/xyz',
			method: 'GET'
		};
		rest(req, res, mockUNext);
		assert.equal(JSON.parse(res.body).url, 'xyz');
	});

	it('path param', function() {
		resource('/rest', function(){
			get('/{type}/{id}', function(id, type) {
				return {
					type: type,
					id: id
				};
			});
		});

		var res = mockRes(),
			req = {
				url:'/rest/request/123456',
				method: 'GET'
			};
		rest(req, res, mockUNext);
		assert.deepEqual(JSON.parse(res.body),{type:'request',id:'123456'});
	});

	it('single function as param with http method', function() {
		resource('/rest', function() {
			get(function() {
				return {msg:'ok'};
			});
		});

		var res = mockRes(),
			req = {
				url: '/rest',
				method: 'GET'
			};
		rest(req, res, mockUNext);
		assert.equal(JSON.parse(res.body).msg, 'ok');
	});

	it('204 will be return, if no content returned by resource', function() {
		resource('/rest', function() {
			get(function(){});
		});
		
		var res = mockRes(),
			req = {
				url: '/rest',
				method: 'GET'
			};

		rest(req, res, mockUNext);
		assert.equal(res.code, 204);
	});

	it('nest resource defination support', function() {
		resource('/rest', function() {
			resource('/order', function() {
				get('/list',function(){});
			});
		});

		var res = mockRes(),
			req = {
				url: '/rest/order/list',
				method: 'GET'
			};
		rest(req, res, mockUNext);
		assert.equal(res.code, 204);
	});

	it('convert common exception to server internal error', function () {
		resource('/rest', function() {
			get(function() { 
				throw 'error';
			});
		});

		var res = mockRes(),
			req = {
				url: '/rest',
				method: 'GET'
			};
		rest(req, res, mockUNext);
		assert.equal(res.code,500);
		assert.equal(JSON.parse(res.body),"'error'");
	});

	it('handle special error throwen by resource', function() {
		resource('/rest', function () {
			get(function() {
				throw {
					code: 501,
					msg: 'Not Implemented'
				};
			});
		});

		var res = mockRes(),
			req = {
				url: '/rest',
				method: 'GET'
			};
		rest(req, res, mockUNext);
		assert.equal(res.code, 501);
		assert.equal(JSON.parse(res.body), 'Not Implemented');
	});
});

