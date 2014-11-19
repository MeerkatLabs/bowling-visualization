/*
 * bowling-webapp
 * https://github.com/MeerkatLabs/bowling-visualization
 *
 * Copyright (c) 2014 Meerkat Labs
 * http://www.meerkatlabsllc.com/
 * Licensed under the MIT License
 */

/**
 * Controller to show the split statistics.
 */
(function() {

    function PlayerSplitsCtrl($scope, PlayerDetailService, playerEvents) {

        var controller = this;

        $scope.$on(playerEvents.found, function(event, data) {

            PlayerDetailService.getSplitStatistics(data.league, data.team, data.player).then(function (results) {

                var data = [];
                data.push({
                    label: "Open",
                    value: results.open
                });
                data.push({
                    label: "Converted",
                    value: results.converted
                });

                controller.data = data;
                controller.splits = results.splits;
                controller.converted = results.converted;
                controller.open = results.open;

            });

        });
    }

    angular.module('bowling')
        .controller('PlayerSplitsCtrl', ['$scope', 'PlayerDetailService', 'playerEvents', PlayerSplitsCtrl]);

}());