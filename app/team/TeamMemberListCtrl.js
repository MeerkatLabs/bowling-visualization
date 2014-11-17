/*
 * bowling-webapp
 * https://github.com/MeerkatLabs/bowling-visualization
 *
 * Copyright (c) 2014 Meerkat Labs
 * http://www.meerkatlabsllc.com/
 * Licensed under the MIT License
 */

/**
 * Controller that will gather the results and display them as a list of the team members in a table.
 */
angular.module('bowling').controller('TeamMembersController', ['$scope', 'dataService', 'TeamDetailService',
    function($scope, dataService, teamDetailService) {

        $scope.$on(bowling.events.team.found, function(event, data) {
            teamDetailService.getTeamList(data.team).then(function (data) {
                $scope.members = data;
            });
        });

    }]);
