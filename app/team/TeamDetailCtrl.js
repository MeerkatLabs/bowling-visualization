/*
 * bowling-webapp
 * https://github.com/MeerkatLabs/bowling-visualization
 *
 * Copyright (c) 2014 Meerkat Labs
 * http://www.meerkatlabsllc.com/
 * Licensed under the MIT License
 */

(function() {

    /**
     * Finds the team that is being displayed by the controller.
     * @param $scope used to broadcast events.
     * @param $routeParams parameters to get the team identifier.
     * @param {string} $routeParams.teamId the identifier of the team.
     * @param $timeout time out that will delay the transmission of the broadcast event.
     * @param TeamFindService service that finds the team.
     * @param teamEvents constant containing the names of the events to be transmitted.
     * @param {string} teamEvents.found the event name for reporting that the team has been found.
     * @constructor
     */
    var TeamDetailCtrl = function($scope, $routeParams, $timeout, TeamFindService, teamEvents) {

        var controller = this;

        TeamFindService.findTeam($routeParams.teamId).then(function (data) {

            $timeout(function() {
                $scope.$broadcast(teamEvents.found, data);
            });

            controller.team = data.team;
            controller.league = data.league;

        });

    };

    angular.module('bowling')
        .controller('TeamDetailCtrl',
                    ['$scope', '$routeParams', '$timeout', 'TeamFindService', 'teamEvents', TeamDetailCtrl]);

}());
