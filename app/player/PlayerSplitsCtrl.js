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

angular.module('bowling')
    .controller('PlayerSplitsCtrl', ['$scope', 'PlayerDetailService', function($scope, PlayerDetailService) {

        $scope.$on(bowling.events.player.found, function(event, data) {

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

                $scope.data = data;
                $scope.splits = results.splits;
                $scope.converted = results.converted;
                $scope.open = results.open;

            });

        });

    }]);
