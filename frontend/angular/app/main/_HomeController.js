define(['app'], function (app) {
    app.controller('HomeController', ['$scope', '$rootScope', '$location', '$log', '$http', 'Users',
        function ($scope, $rootScope, $location, $log, $http, Users) {
            // var bgImagesList = ['01.jpg',
            //     '02.jpg', '03.jpg', '04.jpg',
            //     '05.jpg', '06.jpg', '07.jpg',
            //     '08.jpg', '09.jpg', '10.jpg',
            //     '11.jpg'];
            // var bgimg = bgImagesList[Math.floor(Math.random() * bgImagesList.length)];

            // $rootScope.setBackground = function () {
            //     return {
            //         'background-image': 'url(assets/img/backgrounds/' + bgimg + ')'
            //     }
            // };

            if ($rootScope.user) {
                $scope.user = $rootScope.user;
                if ($scope.user.role == 0) {
                    $scope.user.role_admin = true;
                } else {
                    $scope.user.role_default = true;
                }
                console.log($scope.user);
                $scope.login = 'Sign Out';
                $scope.register = 'User Settings';
            } else {
                $scope.login = 'Sign On';
                $scope.register = 'Sign Up';
            }

            $scope.userRegister = function () {
                if (!$rootScope.user) {
                    $location.url('/NewUser')
                } else {
                    $location.url('/UserHome/' + $rootScope.user._id)
                }
            };

            $scope.userLogin = function () {
                if (!$rootScope.user) {
                    $location.url('/UserLogin')
                } else {
                    $scope.login = 'Sign On';
                    delete $rootScope.user;
                    delete $scope.user;
                    $http.post('/users/logout',{}).then(function (response) {
                        console.log(response.data.mess);
                    });
                }
            };

            $scope.projects = function () {
                $location.url('/Projects')
            };


            $scope.callUserView = function () {
                users = Users.query();

                users.$promise.then(
                    function (data) {
                        if (data.length == 0) {
                            $location.url('/NewUser')
                        } else {
                            $location.url('/UsersList')
                        }

                    });
            };

        }]);
});