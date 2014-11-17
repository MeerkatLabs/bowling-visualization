/*
 * bowling-webapp
 * https://github.com/MeerkatLabs/bowling-visualization
 *
 * Copyright (c) 2014 Meerkat Labs
 * http://www.meerkatlabsllc.com/
 * Licensed under the MIT License
 */

/**
 * Controller that fetches the handicap over time from the PlayerDataService and provides a bar graph showing that data.
 */
angular.module('bowling').controller('PlayerHandicapCtrl', ['$scope', 'PlayerDetailService',
    function($scope, PlayerDetailService) {

        $scope.$on(bowling.events.player.found, function(event, data) {

            PlayerDetailService.handicapOverTime(data.player).then(function (data) {
               $scope.data = data;
            });

        });

    }]);
