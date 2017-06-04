define(['app','datatables_bs'], function (app) {
    app.controller('ProjectsHomeController', ['$scope', '$rootScope', '$location', '$http',
        function ($scope, $rootScope, $location, $http) {
            $scope.formData = {};
            var table = null;

            $http.get('/api/projects').then(function (response) {
                console.log(response.data);
                $scope.projects = response.data;
                var dataset = $.map(response.data, function(obj){
                    return [Object.keys(obj).map(function (key) { 
                        return obj[key];
                     })];
                });

                table = angular.element('#example')
                    .DataTable({
                        data: dataset,
                        columns: [
                            { title: "No" },
                            { title: "Nombre" },
                            { title: "Fecha de Creaci&oacuten" },
                            { title: "Personas Beneficiadas" },
                            { title: "Acciones" }
                        ],
                        columnDefs: [ {
                            "targets": -1,
                            "data": null,
                            "defaultContent": '<button class="edit" ><i class="fa fa-pencil" ></i></button> \
                                               <button class="delete"><i class="fa fa-trash"></button>'
                        } ]
                    });
            });
            
            //DELETE PROJECT
            angular.element('#example').on( 'click', '.delete', function () {
                $scope.del_record = table.row( $(this).parents('tr') );
                $scope.data_record = $scope.del_record.data();
                angular.element('#confirm-modal').modal('show')
                $scope.$apply()
            } );

            angular.element('#confirm-modal').on('click','#del_true', function(){
                angular.element('#confirm-modal')
                    .modal('hide')
                    .on('hidden.bs.modal', function (e) {
                        $http.delete('/api/projects/' + $scope.data_record[0]).then(function (response) {
                            $scope.projects = response.data;
                            table.row($scope.del_record).remove().draw(false);
                            $scope.del_record = null;
                            $scope.data_record = null;
                            $scope.$apply();
                    })
                });
            });

            //EDIT PROJECT
            angular.element('#example').on( 'click', '.edit', function () {
                $scope.$apply();
                edit_record = table.row( $(this).parents('tr') ).data();
                $location.url('/Project?id=' + edit_record[0]);
            });
                
            
        }])

});
