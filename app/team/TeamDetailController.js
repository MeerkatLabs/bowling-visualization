/*
 * bowling-webapp
 * https://github.com/MeerkatLabs/bowling-visualization
 *
 * Copyright (c) 2014 Meerkat Labs
 * http://www.meerkatlabsllc.com/
 * Licensed under the MIT License
 */

var bowlingApp = bowlingApp || angular.module('bowling');

bowlingApp.controller('TeamDetailController', ['$scope', '$routeParams', 'dataService',
    function ($scope, $routeParams, dataService) {

        dataService.getData().then(function (league) {
            var foundTeam = bowling.utils.findInArray(league.teams, function (element) {
                return $routeParams.teamId == element.id;
            });

            if (foundTeam === null) {
                console.error("Couldn't find team: " + $routeParams.teamId);
                return;
            }

            $scope.team = foundTeam;

            $scope.$broadcast('foundTeam', foundTeam);
        });

    }]);
