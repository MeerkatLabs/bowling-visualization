/*
 * bowling-webapp
 * https://github.com/MeerkatLabs/bowling-visualization
 *
 * Copyright (c) 2014 Meerkat Labs
 * http://www.meerkatlabsllc.com/
 * Licensed under the MIT License
 */

var bowlingApp = bowlingApp || angular.module('bowling');

bowlingApp.controller('NavBarController', ['$scope', 'dataService',
    function ($scope, dataService) {

        dataService.getData().then(function (league) {
            $scope.teams = league.teams;
            $scope.name = league.name;
        });

    }
]);