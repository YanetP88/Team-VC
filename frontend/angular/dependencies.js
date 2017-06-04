require.config({
    baseUrl: '/',
    paths: {
        jquery              : 'libs/jquery/dist/jquery.min',
        boostrap            : 'libs/bootstrap/dist/js/bootstrap.min',
        angular             : 'libs/angular/angular',
        angularAMD          : 'libs/angularAMD/dist/angularAMD.min',
        ngload              : 'libs/angularAMD/dist/ngload.min',
        angular_animate     : 'libs/angular-animate/angular-animate.min',
        angular_chessboard  : 'libs/angular-chessboard/angular-chessboard',
        angular_resource    : 'libs/angular-resource/angular-resource',
        angular_route       : 'libs/angular-route/angular-route',
        angular_css         : 'libs/angular-css/angular-css',
        angular_middle      : 'libs/angular-middle/angular-middle',
        cropper             : 'libs/cropper/cropper',
        datatables          : 'libs/datatables/js/jquery.dataTables.min',
        datatables_bs       : 'libs/datatables_bs/js/dataTables.bootstrap.min',

        // APP MODULES SERVICE, CONTROLLERS, and PERSONAL SCRIPTS
        // HOME
        HomeController      : 'app/main/_HomeController',
        HomeServices        : 'app/main/_HomeServices',
        HomeDirectives      : 'app/main/_HomeDirectives',

        // USERS
        UsersController       : 'app/users/_UsersController',
        UsersLoginController  : 'app/users/_UsersLoginController',
        UserProfileController : 'app/users/_UserProfileController',
        UsersServices         : 'app/users/_UsersServices',
        //UsersDirectives      : 'app/users/_UsersDirectives',
        //cropAvatar           : 'app/users/cropAvatar'

        //PROJECTS
        ProjectsHomeController       : 'app/projects/projects_home/_ProjectsHomeController',
        ProjectsNewController        : 'app/projects/projects_new/_ProjectsNewController'

    },
    shim : {
        jquery : {
            exports : '$'
        },
        angular             : ['jquery'],
        boostrap            : ['jquery'],
        cropper             : ['jquery','boostrap'],
        datatables_bs       : ['jquery','boostrap','datatables'],
        angularAMD          : ['angular'],
        ngload              : ['angularAMD'],
        angular_animate     : ['angular'],
        angular_resource    : ['angular'],
        angular_route       : ['angular'],
        angular_css         : ['angular','angular_route'],
        angular_middle      : ['angular']
    },
    map: {
      '*': {
        'datatables.net': 'datatables',
        }
    },
    deps: ['app']
});