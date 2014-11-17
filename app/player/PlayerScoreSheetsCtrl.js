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
angular.module('bowling').controller("PlayerScoreSheetsCtrl", ['$scope', 'PlayerDetailService',
    function($scope, PlayerDetailService) {

        console.log("Subscribing to player found event");
        $scope.$on(bowling.events.player.found, function(event, data) {

          PlayerDetailService.getScoreSheets(data.player).then(function(data) {
              $scope.matches = data;
              $scope.hasMatches = data.length > 0;

              console.log("Matches", data);
          });

        });

    }]);
