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
angular.module('bowling').controller('PlayerGameSeriesRangeCtrl', ['$scope', 'PlayerDetailService',
    function($scope, PlayerDetailService) {

        $scope.$on(bowling.events.player.found, function (event, data) {

            PlayerDetailService.minMaxScores(data.player).then(function (data) {

                console.log('range data', data);

                $scope.gameScratch = [data.gameMinimum, data.gameMaximum];
                $scope.seriesScratch = [data.seriesMinimum, data.seriesMaximum];

            });

        });

    }]);
