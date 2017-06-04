define(['app', 'u_datatables'], function (app) {
    app.controller('ProjectsHomeController', ['$scope', '$rootScope', '$location', '$http', 'datatable',
        function ($scope, $rootScope, $location, $http, datatable) {
            $scope.formData = {};

            var datatableConfig = {
                "name": "simple_datatable",
                "columns": [
                    {
                        "header": "No.",
                        "property": "id",
                        "type": "text"
                    },
                    {
                        "header": "Nombre",
                        "property": "name",
                        "type": "text",
                    },
                    {
                        "header": "Motivación",
                        "property": "motivation",
                        "type": "text",
                        "hide": true
                    },
                    {
                        "header": "Beneficiarios",
                        "property": "benefits",
                        "type": "text",
                        "hide": true
                    },
                    {
                        "header": "Tiempo de Construcción",
                        "property": "construction_time",
                        "type": "text",
                        "hide": true
                    },
                    {
                        "header": "Fecha de Creación",
                        "property": "createdAt",
                        "order": true,
                        "type": "date",
                        "hide": true
                    },
                    {
                        "header": "Fecha de Creación 2",
                        "property": "creation_date",
                        "order": true,
                        "type": "date",
                        "hide": true
                    },
                    {
                        "header": "Descripción",
                        "property": "description",
                        "type": "text",
                        "hide": true
                    },
                    {
                        "header": "Inversionista",
                        "property": "investment",
                        "type": "text",
                        "hide": true
                    },
                    {
                        "header": "Fecha de Registro",
                        "property": "registry_date",
                        "order": true,
                        "type": "date",
                        "hide": true
                    },
                    {
                        "header": "Fecha de Actuaización",
                        "property": "updatedAt",
                        "order": true,
                        "type": "date",
                        "hide": true
                    },
                    {
                        "header": "Dirección",
                        "property": "address",
                        "type": "text",
                        "hide": true
                    }
                ],
                "filter": {
                    "active": true,
                    "highlight": true,
                    "columnMode": false
                },
                "pagination": {
                    "mode": 'local',
                    "bottom": true,
                    "numberRecordsPerPageList": [{
                        number: 10,
                        clazz: ''
                    }, {
                        number: 25,
                        clazz: ''
                    }]
                },
                "order": {
                    "mode": 'local'
                },
                "remove": {
                    "active": true,
                    "mode": 'remote',
                    "url": function (value) {
                        return '/api/projects/' + value.id;
                    }
                },
                "compact": true,
                "hide": {
                    "active": true,
                    "byDefault": [
                        "address",
                        "description"
                    ]
                },
                "show" : {
                    "active":true,
                    "showButton":true,
                    "add":function(project){
                        $location.url('/Project?id=' + project.id);
                    }
                },
                "select":{
                    "active":true,//Active or not
                    "showButton":true,//Show the select all button in the toolbar,
                },
                "mouseevents": {
                    "active": true,
                    "clickCallback": function (line, data) {
                        console.log("callback select : " + data.name);
                    }
                }
            };

            //GET ALL PROJECTS
            $http.get('/api/projects').then(function (response) {
                console.log(response.data);
                $scope.projects = response.data;

                $scope.datatable = datatable(datatableConfig);
                $scope.datatable.setData($scope.projects);
            });

        }])

});
