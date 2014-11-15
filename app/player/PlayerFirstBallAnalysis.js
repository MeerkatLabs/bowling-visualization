/*
 * bowling-webapp
 * https://github.com/MeerkatLabs/bowling-visualization
 *
 * Copyright (c) 2014 Meerkat Labs
 * http://www.meerkatlabsllc.com/
 * Licensed under the MIT License
 */

/**
 * Controller that will determine the first ball analysis data.
 */

angular.module('bowling')
    .controller('PlayerFirstBallAnalysis', ['$scope', 'PlayerDetailService', function ($scope, PlayerDetailService) {

        $scope.$on(bowling.events.player.found, function(event, data) {
           PlayerDetailService.firstBallAnalysis(data.league, data.team, data.player).then(function (results) {
               $scope.data = results;
           });
        });

    }]);
