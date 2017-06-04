define(['app'], function (app) {
    app.controller('UsersLoginController', ['$scope', '$rootScope', '$routeParams', '$location', '$http', 'Users',
        function ($scope, $rootScope, $routeParams, $location, $http, Users) {

            $scope.user = {};

            $scope.loginUser = function () {
                $http.post('/login', {
                    email: $scope.user.email,
                    password: $scope.user.password
                }).then(function (response) {
                    $scope.server_message = response.data.mess;
                    $rootScope.user = response.data.user;
                    $scope.user = response.data.user;
                    console.log($scope.server_message);
                    $location.url('/');
                });
            };

        }])

});
