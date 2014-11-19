/*
 * bowling-webapp
 * https://github.com/MeerkatLabs/bowling-visualization
 *
 * Copyright (c) 2014 Meerkat Labs
 * http://www.meerkatlabsllc.com/
 * Licensed under the MIT License
 */

/**
 * Controller that will display a graph that will show the range of values for the games and series values.
 */
(function() {

    function PlayerGameSeriesRangeCtrl($scope, PlayerDetailService, playerEvents) {

        var controller = this;

        $scope.$on(playerEvents.found, function (event, data) {

            PlayerDetailService.minMaxScores(data.player).then(function (data) {
                controller.gameScratch = [data.gameMinimum, data.gameMaximum];
                controller.seriesScratch = [data.seriesMinimum, data.seriesMaximum];

            });

        });
    }

    angular.module('bowling')
        .controller('PlayerGameSeriesRangeCtrl',
                    ['$scope', 'PlayerDetailService', 'playerEvents', PlayerGameSeriesRangeCtrl]);
}());
