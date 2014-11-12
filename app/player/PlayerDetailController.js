/**
 * Created by rerobins on 11/8/14.
 */

var bowlingApp = bowlingApp || angular.module('bowling');

bowlingApp.controller('PlayerDetailController', ['$scope', '$routeParams', 'dataProvider', 'd3Service',
    function ($scope, $routeParams, dataProvider, d3Service) {

        dataProvider.getData().then(function (league) {
            var foundTeam = bowling.utils.findInArray(league.teams, function (element) {
                return $routeParams.teamId == element.id;
            });

            if (foundTeam === null) {
                console.error("Couldn't find team: " + $routeParams.teamId);
                return;
            }

            var foundPlayer = bowling.utils.findInArray(foundTeam.players, function (element) {
                return $routeParams.playerId == element.id;
            });

            if (foundPlayer === null) {
                console.error("Couldn't find team: " + $routeParams.playerId);
                return;
            }

            $scope.team = foundTeam;
            $scope.roller = foundPlayer;
            $scope.league = league;

            var data = [];

            foundPlayer.serieses.forEach(function (element) {

                var week = {
                    weekNumber: element.week.weekNumber,
                    date: element.week.date,
                    data: {
                        games: []
                    }
                };

                for (var weekIndex = 0; weekIndex < bowling.currentLeague.gamesPerSeries; ++weekIndex) {
                    week.data.games[weekIndex] = element.games[weekIndex].score;
                }

                week.data.average = element.seriesAverage;
                week.data.incomingAverage = element.playerAverage;
                week.data.averageDifference = element.seriesAverage - element.playerAverage;

                data.push(week);

            });

            d3Service.get().then(function (d3) {

                var incomingAverageLine = d3.svg.line()
                    .x(function (d) {
                        return d.weekNumber;
                    })
                    .y(function (d) {
                        return d.data.incomingAverage;
                    })
                    .interpolate("linear");

                var gameLine = d3.svg.line()
                    .x(function (d) {
                        return d.weekNumber;
                    }).y(function (d) {
                        return d.data.games[0];
                    })
                    .interpolate("linear");

                var gameLine1 = d3.svg.line()
                    .x(function (d) {
                        return d.weekNumber;
                    }).y(function (d) {
                        return d.data.games[1];
                    })
                    .interpolate("linear");

                var gameLine2 = d3.svg.line()
                    .x(function (d) {
                        return d.weekNumber;
                    }).y(function (d) {
                        return d.data.games[2];
                    })
                    .interpolate("linear");

                var average = d3.svg.line()
                    .x(function (d) {
                        return d.weekNumber;
                    }).y(function (d) {
                        return d.data.average;
                    })
                    .interpolate("linear");

                $scope.lines = [
                    {
                        line: gameLine,
                        label: 'Game 1'
                    },
                    {
                        line: gameLine1,
                        label: 'Game 2'
                    },
                    {
                        line: gameLine2,
                        label: 'Game 3'
                    },
                    {
                        line: incomingAverageLine,
                        label: 'Incoming Average'

                    },
                    {
                        line: average,
                        label: 'Series Average'
                    }
                ];
            });

            $scope.data = data;

            console.log(data);

        });
    }]);
