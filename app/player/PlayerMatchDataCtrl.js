/*
 * bowling-webapp
 * https://github.com/MeerkatLabs/bowling-visualization
 *
 * Copyright (c) 2014 Meerkat Labs
 * http://www.meerkatlabsllc.com/
 * Licensed under the MIT License
 */

/**
 * Controller that will find the data associated with building a table to display the statistics for the player
 * for each of the matches that the player participated in.
 */
(function() {

    /**
     * Controller that will display the match data for a player.
     * @param $scope
     * @param PlayerDetailService
     * @param playerEvents
     * @constructor
     */
    function PlayerMatchDataCtrl($scope, PlayerDetailService, playerEvents) {

        this.data = [];
        var controller = this;

        $scope.$on(playerEvents.found, function(event, data) {

            PlayerDetailService.buildDataTable(data.player).then(function (data) {
                controller.data = data;
            });

        });
    }

    angular.module('bowling')
        .controller('PlayerMatchDataCtrl', ['$scope', 'PlayerDetailService', 'playerEvents', PlayerMatchDataCtrl]);
}());
