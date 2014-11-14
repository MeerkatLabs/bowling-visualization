/*
 * bowling-webapp
 * https://github.com/MeerkatLabs/bowling-visualization
 *
 * Copyright (c) 2014 Meerkat Labs
 * http://www.meerkatlabsllc.com/
 * Licensed under the MIT License
 */

/**
 * Loads the match statistics from the data model.
 */
var bowlingApp = bowlingApp || angular.module('bowling');

bowlingApp.controller('TeamMatchListController', ['$scope', 'dataService', 'TeamDetailService',
    function($scope, dataService, teamDetailService) {

        $scope.$on(bowling.events.team.found, function(event, data) {
            teamDetailService.getMatchList(data.team).then(function (data) {
                $scope.matches = data;

                var pointsFor = 0;
                var pointsAgainst = 0;
                data.forEach(function (match) {
                    pointsFor += match.pointsFor;
                    pointsAgainst += match.pointsAgainst;
                });

                $scope.totalPointsFor = pointsFor;
                $scope.totalPointsAgainst = pointsAgainst;
            });
        });

    }]);