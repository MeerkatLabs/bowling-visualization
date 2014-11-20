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

    /**
     * Controller that will provide the template content for the pins per week section.
     * @param $scope
     * @param TeamMatchDetailService
     * @param teamEvents
     * @constructor
     */
    var TeamPinsPerWeekCtrl = function($scope, TeamMatchDetailService, teamEvents) {

        var controller = this;

        $scope.$on(teamEvents.found, function(event, data) {

            TeamMatchDetailService.buildPinsPerMatchData(data.league, data.team).then(function (data) {
                controller.data = data;
            });

        });

    };

    angular.module('bowling')
        .controller('TeamPinsPerWeekCtrl', ['$scope', 'TeamMatchDetailService', 'teamEvents', TeamPinsPerWeekCtrl]);
}());