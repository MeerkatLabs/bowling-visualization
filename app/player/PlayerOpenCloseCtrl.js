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
(function() {

    function PlayerOpenCloseCtrl($scope, PlayerDetailService, playerEvents) {

        var controller = this;

        $scope.$on(playerEvents.found, function(event, data) {

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

                controller.data = data;

                controller.strikes = result.strikes;
                controller.spares = result.spares;
                controller.open = result.open;
                controller.total = result.total;
            });
        });
    }

    angular.module('bowling')
        .controller('PlayerOpenCloseCtrl', ['$scope', 'PlayerDetailService', 'playerEvents', PlayerOpenCloseCtrl]);

}());