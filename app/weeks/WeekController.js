/*
 * bowling-webapp
 * https://github.com/MeerkatLabs/bowling-visualization
 *
 * Copyright (c) 2014 Meerkat Labs
 * http://www.meerkatlabsllc.com/
 * Licensed under the MIT License
 */
angular.module('bowling').controller('LeagueController', ['$scope', 'dataService',
        function ($scope, dataService) {

            var splitSize = 3;

            dataService.getData().then(function (league) {
                $scope.league = league;

                var leagueWeeks = league.weeks.concat();
                var split = [];
                while (leagueWeeks.length > 0) {
                    split.push(leagueWeeks.splice(0,splitSize));
                }

                $scope.splits = split;

            });

        }
    ]);