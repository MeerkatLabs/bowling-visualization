/*
 * bowling-webapp
 * https://github.com/MeerkatLabs/bowling-visualization
 *
 * Copyright (c) 2014 Meerkat Labs
 * http://www.meerkatlabsllc.com/
 * Licensed under the MIT License
 */

(function() {

    var TeamTotalPinsCtrl = function($scope, TeamDetailService, teamEvents) {

        var controller = this;

        $scope.$on(teamEvents.found, function(event, data) {

            TeamDetailService.getPinData(data.team).then(function (data) {

                controller.data = data;

            });

        });

    };

    angular.module('bowling')
        .controller('TeamTotalPinsCtrl', ['$scope', 'TeamDetailService', 'teamEvents', TeamTotalPinsCtrl]);
}());
