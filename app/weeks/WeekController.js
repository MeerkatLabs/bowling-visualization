/*
 * bowling-webapp
 * https://github.com/MeerkatLabs/bowling-visualization
 *
 * Copyright (c) 2014 Meerkat Labs
 * http://www.meerkatlabsllc.com/
 * Licensed under the MIT License
 */

(function() {

    var WeekController = function($scope, DataService) {
        var splitSize = 3;

        DataService.getData().then(function (league) {
            $scope.league = league;

            var leagueWeeks = league.weeks.concat();
            var split = [];
            while (leagueWeeks.length > 0) {
                split.push(leagueWeeks.splice(0,splitSize));
            }

            $scope.splits = split;

        });
    };

    angular.module('bowling').controller('WeekController', ['$scope', 'DataService', WeekController]);

}());