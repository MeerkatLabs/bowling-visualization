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
(function() {

    var TeamMembersCtrl = function($scope, TeamDetailService, teamEvents) {

        var controller = this;

        $scope.$on(teamEvents.found, function(event, data) {
            TeamDetailService.getTeamList(data.team).then(function (data) {
                controller.members = data;
            });
        });

    };

    angular.module('bowling')
        .controller('TeamMembersListCtrl', ['$scope', 'TeamDetailService', 'teamEvents', TeamMembersCtrl]);

}());