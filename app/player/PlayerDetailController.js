/*
 * bowling-webapp
 * https://github.com/MeerkatLabs/bowling-visualization
 *
 * Copyright (c) 2014 Meerkat Labs
 * http://www.meerkatlabsllc.com/
 * Licensed under the MIT License
 */

angular.module('bowling').controller('PlayerDetailController', ['$scope', '$routeParams', '$timeout', 'PlayerDetailService',
    function ($scope, $routeParams, $timeout, PlayerDetailService) {

        PlayerDetailService.findPlayer($routeParams.teamId, $routeParams.playerId).then(function(data) {
            $scope.team = data.team;
            $scope.roller = data.player;
            $scope.league = data.league;

            $timeout(function() {
                $scope.$broadcast(bowling.events.player.found, data);
            });
        });

    }]);
