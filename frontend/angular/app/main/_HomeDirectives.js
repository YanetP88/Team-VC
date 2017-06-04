define(['app'], function (app) {
    app.directive('HomeDirectives', ['$scope', '$log', function ($scope, $log) {
        $log.info('Hola!');

    }]);
});
