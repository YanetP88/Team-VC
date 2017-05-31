var rest = require('../rest')({mode:'test'}),
	mockRes = require('./resHelper').mockResponse,
	mockUNext = require('./resHelper').mockUNext,
	mockNext = require('./resHelper').mockNext,
	Q = require('q');
	assert = require('assert');

debugger;
describe('support async response', function() {
	beforeEach(function() {
		rest.clear();
	});

	it('framework will giveup control, if httpResponse is binded to arguments of handler', function() {
		resource('/rest', function() {
			get(function(httpResponse) {
				httpResponse.writeHead(123,'head');
				httpResponse.end('my body');
			});
		});

		var res = mockRes(),
			req = {
				url: '/rest',
				method: 'GET'
			};

		rest(req, res, mockUNext);
		assert.equal(res.code,123);
		assert.equal(res.head,'head');
		assert.equal(res.body,'my body');
	});

	it('response will be async, if a promise rejected from handlder', function(done) {
		function promiseReturn() {
			var deferred = Q.defer();
			process.nextTick(function(){
				return deferred.reject({code:505, msg:'fail'});
			});
			return deferred.promise;
		}

		resource('/rest', function() {
			get(function() {
				return promiseReturn();
			});
		});

		var res = mockRes(),
			req = {
				url: '/rest',
				method: 'GET'
			};

		rest(req, res, mockUNext);
		process.nextTick(function() {
			assert.equal(res.code, 505);
			assert.equal(res.body,JSON.stringify('fail'));
			done();
		});
	});

	it('response will be async, if a promise return from handlder', function(done) {
		function promiseReturn() {
			var deferred = Q.defer();
			process.nextTick(function(){
				return deferred.resolve({msg:'ok'});
			});
			return deferred.promise;
		}

		resource('/rest', function() {
			get(function() {
				return promiseReturn();
			});
		});

		var res = mockRes(),
			req = {
				url: '/rest',
				method: 'GET'
			};

		rest(req, res, mockUNext);
		process.nextTick(function() {
			assert.equal(res.code, 200);
			assert.equal(res.body,JSON.stringify({msg:'ok'}));
			done();
		});
	});
});
