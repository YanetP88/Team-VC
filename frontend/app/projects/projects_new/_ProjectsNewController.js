define(['app'], function (app) {
    app.controller('ProjectsNewController', ['$scope', '$rootScope', '$routeParams', '$location', '$http',
        function ($scope, $rootScope, $routeParams, $location, $http) {
            $scope.formData = {};
            $scope.action = "Create";

            if ($routeParams.id) {
                $http.get('/api/projects/' + $routeParams.id).then(function (response) {
                    project_data = response.data;
                    project_data.createdAt = new Date(response.data.createdAt);
                    project_data.creation_date = new Date(response.data.creation_date);
                    project_data.registry_date = new Date(response.data.registry_date);
                    project_data.construction_time = new Date(response.data.construction_time);
                    $scope.formData = project_data;
                    $scope.action = "Update";
                    console.log(project_data)
                });
            }

            $scope.createProject = function () {
                if ($routeParams.id) {
                    $http.post('/api/projects/' + $routeParams.id, $scope.formData).then(function (response) {
                        console.log(response.data.mess);
                    });
                } else {
                    $http.post('/api/projects', $scope.formData).then(function (response) {
                        // $scope.formData = {};
                        console.log(response.data.mess);
                        $location.url('/Projects');
                    });
                }

            };
        }
    ])
});
