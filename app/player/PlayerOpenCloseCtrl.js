/*
 * bowling-webapp
 * https://github.com/MeerkatLabs/bowling-visualization
 *
 * Copyright (c) 2014 Meerkat Labs
 * http://www.meerkatlabsllc.com/
 * Licensed under the MIT License
 */

/**
 * Controller that will display the bowling open/close statistics.
 */

angular.module('bowling')
    .controller('PlayerOpenCloseCtrl', ['$scope', 'PlayerDetailService', function ($scope, PlayerDetailService) {

        $scope.$on(bowling.events.player.found, function(event, data) {
            PlayerDetailService.getOpenCloseStatistics(data.league, data.team, data.player).then(function(result) {
                var data = [];

                data.push({
                    label: 'Strikes',
                    value: result.strikes
                });
                data.push({
                    label: 'Spares',
                    value: result.spares
                });
                data.push({
                    label: 'Open',
                    value: result.open
                });

                $scope.data = data;

                $scope.strikes = result.strikes;
                $scope.spares = result.spares;
                $scope.open = result.open;
                $scope.total = result.total;
            });
        });

    }]);
