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

    /**
     * Controller that will provide the details for the team members and their data contributions to the overall
     * team picture.
     * @param $scope
     * @param TeamMemberDetailService
     * @param teamEvents
     * @constructor
     */
    var TeamMembersCtrl = function($scope, TeamMemberDetailService, teamEvents) {

        var controller = this;

        $scope.$on(teamEvents.found, function(event, data) {
            TeamMemberDetailService.getMemberDetails(data.league, data.team).then(function (data) {
                controller.members = data;
            });
        });

    };

    angular.module('bowling')
        .controller('TeamMembersListCtrl', ['$scope', 'TeamMemberDetailService', 'teamEvents', TeamMembersCtrl]);

}());