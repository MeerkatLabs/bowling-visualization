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
     * Controller that will provide the content for the total pins provided by each team member.
     * @param $scope
     * @param TeamMemberDetailService
     * @param teamEvents
     * @constructor
     */
    var TeamTotalPinsCtrl = function($scope, TeamMemberDetailService, teamEvents) {

        var controller = this;

        $scope.$on(teamEvents.found, function(event, data) {

            TeamMemberDetailService.getMemberPinDetail(data.league, data.team).then(function (data) {

                controller.data = data;

            });

        });

    };

    angular.module('bowling')
        .controller('TeamTotalPinsCtrl', ['$scope', 'TeamMemberDetailService', 'teamEvents', TeamTotalPinsCtrl]);
}());
