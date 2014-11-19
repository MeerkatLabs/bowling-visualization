/*
 * bowling-webapp
 * https://github.com/MeerkatLabs/bowling-visualization
 *
 * Copyright (c) 2014 Meerkat Labs
 * http://www.meerkatlabsllc.com/
 * Licensed under the MIT License
 */

/**
 * Control which will fetch the score sheets for the player if they exist.
 */
(function() {

    function PlayerScoreSheetsCtrl($scope, PlayerDetailService, playerEvents) {

        var controller = this;

        $scope.$on(playerEvents.found, function(event, data) {

            PlayerDetailService.getScoreSheets(data.player).then(function(data) {
                controller.matches = data;
                controller.hasMatches = data.length > 0;
            });

        });
    }

    angular.module('bowling')
        .controller("PlayerScoreSheetsCtrl", ['$scope', 'PlayerDetailService', 'playerEvents', PlayerScoreSheetsCtrl]);

}());