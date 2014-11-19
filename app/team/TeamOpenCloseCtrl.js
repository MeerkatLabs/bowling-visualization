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
(function() {

    var TeamOpenCloseCtrl = function($scope, TeamDetailService, teamEvents) {

        var controller = this;

        $scope.$on(teamEvents.found, function(event, data) {

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

                controller.data = data;

                controller.strikes = result.strikes;
                controller.spares = result.spares;
                controller.open = result.open;
                controller.total = result.total;
            });

        });

    };

    angular.module('bowling')
        .controller('TeamOpenCloseCtrl', ['$scope', 'TeamDetailService', 'teamEvents', TeamOpenCloseCtrl]);

}());