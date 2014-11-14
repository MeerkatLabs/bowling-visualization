/*
 * bowling-webapp
 * https://github.com/MeerkatLabs/bowling-visualization
 *
 * Copyright (c) 2014 Meerkat Labs
 * http://www.meerkatlabsllc.com/
 * Licensed under the MIT License
 */

var bowlingApp = bowlingApp || angular.module('bowling');

bowlingApp.controller('TeamDetailController', ['$scope', '$routeParams', '$timeout', 'TeamFindService',
    function ($scope, $routeParams, $timeout, TeamFindService) {

        TeamFindService.findTeam($routeParams.teamId).then(function (data) {

            $timeout(function() {
                $scope.$broadcast(bowling.events.team.found, data);
            });

            $scope.team = data.team;
            $scope.league = data.league;

        });

    }]);
