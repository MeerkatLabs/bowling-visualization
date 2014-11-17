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
angular.module('bowling').controller('PlayerMatchDataCtrl', ['$scope', 'PlayerDetailService', function ($scope, PlayerDetailService) {

    $scope.$on(bowling.events.player.found, function(event, data) {
        PlayerDetailService.buildDataTable(data.player).then(function (data) {
            $scope.data = data;
        });
    });

}]);
