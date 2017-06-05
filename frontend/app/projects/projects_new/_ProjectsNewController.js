define(['app', 'angular_upload'], function (app) {
    app.controller('ProjectsNewController', ['$scope', '$rootScope', '$routeParams', '$location', '$http', 'FileUploader',
        function ($scope, $rootScope, $routeParams, $location, $http, FileUploader) {

            $scope.formData = {};
            $scope.formData.images = [];
            $scope.action = "Create";

            var file_to_delete = [];


            if ($routeParams.id) {
                $http.get('/api/projects/' + $routeParams.id).then(function (response) {
                    project_data = response.data;
                    project_data.createdAt = new Date(response.data.createdAt);
                    project_data.creation_date = new Date(response.data.creation_date);
                    project_data.registry_date = new Date(response.data.registry_date);
                    project_data.construction_time = new Date(response.data.construction_time);
                    $scope.formData = project_data;

                    imgs = $scope.formData.images.split(',').filter(function(n){ return n != "" });

                    $scope.formData.images = imgs;

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

                if (file_to_delete.length != 0) {
                    file_to_delete.map(function (file) {
                        $http.post('/delete_file', {file: file}).then(function (res, req) {
                            console.log('file ' + file + 'Deleted');
                        })
                    })
                }
            };

            $scope.deleteImage = function (image) {
                var index = $scope.formData.images.indexOf(image);
                if (index > -1) {
                    $scope.formData.images.splice(index, 1);
                    file_to_delete.push(image);
                }
            };

            $scope.view_images_uploader = false;
            var uploader = $scope.uploader = new FileUploader({
                url: '/upload_file',
                method: 'POST',
                alias: 'images',
                data: $scope.formData
            });

            // FILTERS

            // a sync filter
            uploader.filters.push({
                name: 'syncFilter',
                fn: function (item /*{File|FileLikeObject}*/, options) {
                    // console.log('syncFilter');
                    return this.queue.length < 10;
                }
            });

            // an async filter
            uploader.filters.push({
                name: 'asyncFilter',
                fn: function (item /*{File|FileLikeObject}*/, options, deferred) {
                    // console.log('asyncFilter');
                    setTimeout(deferred.resolve, 1e3);
                }
            });

            // CALLBACKS

            uploader.onWhenAddingFileFailed = function (item /*{File|FileLikeObject}*/, filter, options) {
                // console.info('onWhenAddingFileFailed', item, filter, options);
            };
            uploader.onAfterAddingFile = function (fileItem) {
                $scope.view_images_uploader = true;
                // console.info('onAfterAddingFile', fileItem);
            };
            uploader.onAfterAddingAll = function (addedFileItems) {
                // console.info('onAfterAddingAll', addedFileItems);
            };
            uploader.onBeforeUploadItem = function (item) {
                // console.info('onBeforeUploadItem', item);
            };
            uploader.onProgressItem = function (fileItem, progress) {
                // console.info('onProgressItem', fileItem, progress);
            };
            uploader.onProgressAll = function (progress) {
                // console.info('onProgressAll', progress);
            };
            uploader.onSuccessItem = function (fileItem, response, status, headers) {
                // console.info('onSuccessItem', fileItem, response, status, headers);
            };
            uploader.onErrorItem = function (fileItem, response, status, headers) {
                // console.info('onErrorItem', fileItem, response, status, headers);
            };
            uploader.onCancelItem = function (fileItem, response, status, headers) {
                // console.info('onCancelItem', fileItem, response, status, headers);
            };
            uploader.onCompleteItem = function (fileItem, response, status, headers) {
                $scope.formData.images.push(response.file);
                $scope.view_images_uploader = false;
            };
            uploader.onCompleteAll = function () {
                uploader.clearQueue();
                console.info('Uploaded ALL');
            };

            console.info('uploader', uploader);
        }
    ]).directive('ngThumb', ['$window', function ($window) {
        var helper = {
            support: !!($window.FileReader && $window.CanvasRenderingContext2D),
            isFile: function (item) {
                return angular.isObject(item) && item instanceof $window.File;
            },
            isImage: function (file) {
                var type = '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        };

        return {
            restrict: 'A',
            template: '<canvas/>',
            link: function (scope, element, attributes) {
                if (!helper.support) return;

                var params = scope.$eval(attributes.ngThumb);

                if (!helper.isFile(params.file)) return;
                if (!helper.isImage(params.file)) return;

                var canvas = element.find('canvas');
                var reader = new FileReader();

                reader.onload = onLoadFile;
                reader.readAsDataURL(params.file);

                function onLoadFile(event) {
                    var img = new Image();
                    img.onload = onLoadImage;
                    img.src = event.target.result;
                }

                function onLoadImage() {
                    var width = params.width || this.width / this.height * params.height;
                    var height = params.height || this.height / this.width * params.width;
                    canvas.attr({width: width, height: height});
                    canvas[0].getContext('2d').drawImage(this, 0, 0, width, height);
                }
            }
        };
    }])
});
