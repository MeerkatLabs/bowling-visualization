/**
 * Created by rerobins on 11/8/14.
 */

var bowlingApp = bowlingApp || angular.module('bowling');

bowlingApp.controller('MatchController', ['$scope', '$routeParams', 'dataService',
    function ($scope, $routeParams, dataService) {
        dataService.getData().then(function (league) {
            $scope.league = league;
            $scope.matchId = $routeParams.matchId;

            var foundMatch = null;
            league.weeks.forEach(function (week) {
                if (foundMatch == null) {
                    week.matches.forEach(function (match) {
                        if (foundMatch == null && match.id == $routeParams.matchId) {
                            foundMatch = match;
                        }
                    });
                }
            });
            console.log(foundMatch);
            $scope.match = foundMatch;
            $scope.hasScores = false;

            foundMatch.scores.forEach(function(teamSeries) {
               if (!$scope.hasScores) {
                   teamSeries.playerSeries.forEach(function(playerSeries) {
                      if (!$scope.hasScores) {
                          playerSeries.games.forEach(function(game) {
                             if (!$scope.hasScores) {
                                 if (Array.isArray(game.frames) && game.frames.length == 10) {
                                     $scope.hasScores = true;
                                 }
                             }
                          });
                      }
                   });
               }
            });

            var gameCharts = [];
            for (var gameIndex = 0; gameIndex < league.gamesPerSeries; ++gameIndex) {
                var data = [];
                foundMatch.scores.forEach(function (teamSeries, i) {

                    data.push({
                        label: teamSeries.team.name,
                        value: teamSeries.gameTotal[gameIndex]
                    });

                });

                gameCharts.push(data);
            }

            var totalData = [];
            foundMatch.scores.forEach(function (teamSeries, i) {

                totalData.push({
                    label: teamSeries.team.name,
                    value: teamSeries.seriesTotal
                });

            });

            $scope.gameCharts = gameCharts;
            $scope.totalData = totalData;

            console.log($scope);

        });
    }]);