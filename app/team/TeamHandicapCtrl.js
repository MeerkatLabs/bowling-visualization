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

    var TeamHandicapCtrl = function($scope, TeamDetailService, teamEvents) {

        var controller = this;

        $scope.$on(teamEvents.found, function(event, data) {

            TeamDetailService.getHandicapPerWeek(data.league, data.team).then(function(data) {
                controller.data = data;
            });

        });

    };

    angular.module('bowling')
        .controller('TeamHandicapCtrl', ['$scope', 'TeamDetailService', 'teamEvents', TeamHandicapCtrl]);

}());
