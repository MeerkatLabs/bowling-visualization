/*
 * bowling-webapp
 * https://github.com/MeerkatLabs/bowling-visualization
 *
 * Copyright (c) 2014 Meerkat Labs
 * http://www.meerkatlabsllc.com/
 * Licensed under the MIT License
 */

/**
 * Controller that will build a display for pins per week.
 */
angular.module('bowling').controller('TeamPinsPerWeekCtrl', ['$scope', 'TeamDetailService',
    function($scope, TeamDetailService) {

        $scope.$on(bowling.events.team.found, function(event, data) {

            TeamDetailService.buildPinsPerWeekData(data.league, data.team).then(function (data) {
               $scope.data = data;
            });

        });

    }
]);