/*
 * bowling-webapp
 * https://github.com/MeerkatLabs/bowling-visualization
 *
 * Copyright (c) 2014 Meerkat Labs
 * http://www.meerkatlabsllc.com/
 * Licensed under the MIT License
 */

/**
 * Controller that will display the handicap vs. time graph.
 */
(function() {

    /**
     * Controller that will provide the template data for the TeamHandicap section.
     * @param $scope
     * @param TeamMatchDetailService
     * @param teamEvents
     * @constructor
     */
    var TeamHandicapCtrl = function($scope, TeamMatchDetailService, teamEvents) {

        var controller = this;

        $scope.$on(teamEvents.found, function(event, data) {

            TeamMatchDetailService.buildHandicapData(data.league, data.team).then(function(data) {
                controller.data = data;
            });

        });

    };

    angular.module('bowling')
        .controller('TeamHandicapCtrl', ['$scope', 'TeamMatchDetailService', 'teamEvents', TeamHandicapCtrl]);

}());
