/*
 * bowling-webapp
 * https://github.com/MeerkatLabs/bowling-visualization
 *
 * Copyright (c) 2014 Meerkat Labs
 * http://www.meerkatlabsllc.com/
 * Licensed under the MIT License
 */

var bowlingApp = bowlingApp || angular.module('bowling');

bowlingApp.controller('main', ['$scope',
    function ($scope) {

    }
]);

bowlingApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/main',  {
            templateUrl: 'core/partials/main.html',
            controller: 'main'
        });
    }]);