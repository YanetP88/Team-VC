define(['app', 'angular_resource'], function (app) {

var app = angular.module('UsersServices', ['ngResource']);

    app.factory('Users', ['$resource',
        function ($resource) {
            return $resource('/users/info/:userId', {}, {query: {method: 'GET', params: {}, isArray: true}});
        }]);
});