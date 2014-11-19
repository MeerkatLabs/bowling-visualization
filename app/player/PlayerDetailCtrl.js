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
     * Controller that will load the player details and then notify all of the sub-controllers that the player object
     * has been found.
     * @param $scope
     * @param $routeParams
     * @param $timeout
     * @param PlayerDetailService
     * @param playerEvents
     * @constructor
     */
    function PlayerDetailCtrl($scope, $routeParams, $timeout, PlayerDetailService, playerEvents) {

        var controller = this;

        PlayerDetailService.findPlayer($routeParams.teamId, $routeParams.playerId).then(function(data) {
            controller.team = data.team;
            controller.roller = data.player;
            controller.league = data.league;

            $timeout(function() {
                console.log("Broadcasting: " + playerEvents.found, data);
                $scope.$broadcast(playerEvents.found, data);
            });

        });

    }

    angular.module('bowling')
        .controller('PlayerDetailCtrl',
            ['$scope', '$routeParams', '$timeout', 'PlayerDetailService', 'playerEvents', PlayerDetailCtrl]);

}());
