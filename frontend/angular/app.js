define(['angularAMD', 'angular_route', 'angular_css', 'angular_middle', 'UsersServices'], function (angularAMD) {

    var app = angular.module("nehuenChess", ['ngRoute', 'door3.css', 'UsersServices', 'middle']);

    app.config(function ($routeProvider) {
        $routeProvider
            .when("/",
                angularAMD.route({
                    templateUrl: 'app/main/_HomeView.html',
                    controller: 'HomeController'
                })
            )

            .when("/UsersList",
                angularAMD.route({
                    templateUrl: 'app/users/users_list/_UsersListView.html',
                    controller: 'UsersController',
                    css: 'app/users/users_list/_UsersList.css'
                })
            )

            .when("/NewUser",
                angularAMD.route({
                    templateUrl: 'app/users/user_new/_NewUserView.html',
                    controller: 'UsersController',
                    css: ['app/users/user_new/_NewUser.css', 'app/users/user_new/cropAvatar.css', 'libs/cropper/cropper.min.css']
                })
            )

            .when("/UserLogin",
                angularAMD.route({
                    templateUrl: 'app/users/user_login/_UserLoginView.html',
                    controller: 'UsersLoginController',
                    css: ['app/users/user_login/_UserLogin.css']
                })
            )
            .when("/UserHome/:userId",
                angularAMD.route({
                    templateUrl: 'app/users/user_home/_UserHomeView.html',
                    controller: 'UsersController',
                    css: ['app/users/user_new/_NewUser.css','app/users/user_home/_UserHome.css', 'app/users/user_new/cropAvatar.css', 'libs/cropper/cropper.min.css']
                })
            )
            .when("/Projects",
                angularAMD.route({
                    templateUrl: 'app/projects/projects_home/_ProjectsHomeView.html',
                    controller: 'ProjectsHomeController',
                    css: ['libs/datatables_bs/css/dataTables.bootstrap.min.css'] // fix this
                })
            )
            .when("/Project",
                angularAMD.route({
                    templateUrl: 'app/projects/projects_new/_ProjectsNewView.html',
                    controller: 'ProjectsNewController',
                    css: ['app/users/user_new/_NewUser.css'] // fix this
                })
            )
    });

    return angularAMD.bootstrap(app);
});