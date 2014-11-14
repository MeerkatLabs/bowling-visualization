/*
 * bowling-webapp
 * https://github.com/MeerkatLabs/bowling-visualization
 *
 * Copyright (c) 2014 Meerkat Labs
 * http://www.meerkatlabsllc.com/
 * Licensed under the MIT License
 */

/**
 * Controller that will display the handicap vs. time graph.
 */

var bowlingApp = bowlingApp || angular.module('bowling');

bowlingApp.controller('TeamHandicapCtrl', ['$scope', 'TeamDetailService',
    function($scope, TeamDetailService) {

        $scope.$on(bowling.events.team.found, function(event, data) {

            TeamDetailService.getHandicapPerWeek(data.league, data.team).then(function(data) {
               $scope.data = data;
            });

        });

    }]);
