/*
 * bowling-webapp
 * https://github.com/MeerkatLabs/bowling-visualization
 *
 * Copyright (c) 2014 Meerkat Labs
 * http://www.meerkatlabsllc.com/
 * Licensed under the MIT License
 */

(function() {

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

    console.log('TeamDetailController');

    angular.module('bowling')
        .controller('TeamDetailCtrl',
                    ['$scope', '$routeParams', '$timeout', 'TeamFindService', 'teamEvents', TeamDetailCtrl]);

}());
