/*
 * bowling-webapp
 * https://github.com/MeerkatLabs/bowling-visualization
 *
 * Copyright (c) 2014 Meerkat Labs
 * http://www.meerkatlabsllc.com/
 * Licensed under the MIT License
 */

/**
 * Controller that will build a display for pins per week.
 */
(function() {

    var TeamPinsPerWeekCtrl = function($scope, TeamDetailService, teamEvents) {

        var controller = this;

        $scope.$on(teamEvents.found, function(event, data) {

            TeamDetailService.buildPinsPerWeekData(data.league, data.team).then(function (data) {
                controller.data = data;
            });

        });

    };

    angular.module('bowling')
        .controller('TeamPinsPerWeekCtrl', ['$scope', 'TeamDetailService', 'teamEvents', TeamPinsPerWeekCtrl]);
}());