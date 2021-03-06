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
(function() {

    function PlayerFirstBallAnalysis($scope, PlayerDetailService, playerEvents) {
        var controller = this;

        $scope.$on(playerEvents.found, function(event, data) {
            PlayerDetailService.firstBallAnalysis(data.league, data.team, data.player).then(function (results) {
                controller.data = results;
            });
        });
    }

    angular.module('bowling')
        .controller('PlayerFirstBallAnalysis',
                    ['$scope', 'PlayerDetailService', 'playerEvents', PlayerFirstBallAnalysis]);
}());
