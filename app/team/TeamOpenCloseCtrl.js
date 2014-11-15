/*
 * bowling-webapp
 * https://github.com/MeerkatLabs/bowling-visualization
 *
 * Copyright (c) 2014 Meerkat Labs
 * http://www.meerkatlabsllc.com/
 * Licensed under the MIT License
 */

/**
 * Controller to display the strikes spares open data for the team.
 */
angular.module('bowling')
    .controller('TeamOpenCloseCtrl', ['$scope', 'TeamDetailService', function ($scope, TeamDetailService) {

        $scope.$on(bowling.events.team.found, function(event, data) {
            TeamDetailService.getTeamOpenCloseAnalysis(data.league, data.team).then(function(result) {
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