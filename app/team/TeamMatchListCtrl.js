/*
 * bowling-webapp
 * https://github.com/MeerkatLabs/bowling-visualization
 *
 * Copyright (c) 2014 Meerkat Labs
 * http://www.meerkatlabsllc.com/
 * Licensed under the MIT License
 */

/**
 * Loads the match statistics from the data model.
 */
(function() {

    /**
     * Controller that will provide the details for the team match results.
     * @param $scope
     * @param TeamMatchDetailService
     * @param teamEvents
     * @constructor
     */
    var TeamMatchListCtrl = function($scope, TeamMatchDetailService, teamEvents) {

        var controller = this;

        $scope.$on(teamEvents.found, function(event, data) {
            TeamMatchDetailService.buildMatchData(data.league, data.team).then(function (data) {
                controller.matches = data;

                var pointsFor = 0;
                var pointsAgainst = 0;
                data.forEach(function (match) {
                    pointsFor += match.pointsFor;
                    pointsAgainst += match.pointsAgainst;
                });

                controller.totalPointsFor = pointsFor;
                controller.totalPointsAgainst = pointsAgainst;
            });
        });

    };

    angular.module('bowling')
        .controller('TeamMatchListCtrl',
                    ['$scope', 'TeamMatchDetailService', 'teamEvents', TeamMatchListCtrl]);

}());