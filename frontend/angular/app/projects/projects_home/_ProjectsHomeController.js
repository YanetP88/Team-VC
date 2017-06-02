define(['app'], function (app) {
    app.controller('ProjectsHomeController', ['$scope', '$rootScope', '$routeParams', '$location', '$http',
        function ($scope, $rootScope, $routeParams, $location, $http) {
            $scope.formData = {};

            $http.get('/api/projects').then(function (response) {
                console.log(response.data);
                $scope.projects = response.data;
            });

            // when submitting the add form, send the text to the node API
            $scope.createProject = function () {
                $http.post('/api/projects', $scope.formData).then(function (response) {
                    $scope.formData = {};
                    $scope.projects = response.data;
                });
            };

            // delete a todo after checking it
            $scope.deleteProject = function (id) {
                $http.delete('/api/projects/' + id).then(function (response) {
                    $scope.projects = response.data;
                    console.log(response);
                })
            };

        }])

});
