/*
 * bowling-webapp
 * https://github.com/MeerkatLabs/bowling-visualization
 *
 * Copyright (c) 2014 Meerkat Labs
 * http://www.meerkatlabsllc.com/
 * Licensed under the MIT License
 */

/**
 * Team match detail service.
 */
(function() {

    var TeamMatchDetailService = function($q, d3Service) {

        var TeamMatchDetailService = {};

        /**
         * Service call that will fetch the matches from the data object and determine the results of the matches.
         * @param {bowling.League} league
         * @param {bowling.Team} team
         * @returns {*}
         */
        TeamMatchDetailService.buildMatchData = function(league, team) {

            return $q(function(resolve, reject) {
                var data = [];

                league.weeks.forEach(function (week) {

                    week.matches.forEach(function (match) {

                        var matchData = {
                            weekNumber: week.weekNumber,
                            date: week.date,
                            opponent: "",
                            pointsFor: 0,
                            pointsAgainst: 0,
                            matchId: match.id
                        };

                        var teamSeries = null;
                        var otherTeamSeries = null;
                        match.scores.forEach(function (search) {
                            if (search.team.id === team.id) {
                                teamSeries = search;
                            } else {
                                otherTeamSeries = search;
                            }
                        });

                        if (teamSeries !== null) {

                            matchData.opponent = otherTeamSeries.team.name;

                            for (var index = 0; index < league.gamesPerSeries; ++index) {
                                if (teamSeries.gameTotal[index] > otherTeamSeries.gameTotal[index]) {
                                    matchData.pointsFor += league.pointsPerGame;
                                } else if (teamSeries.gameTotal[index] < otherTeamSeries.gameTotal[index]) {
                                    matchData.pointsAgainst += league.pointsPerGame;
                                } else {
                                    matchData.pointsFor += (league.pointsPerGame / 2);
                                    matchData.pointsAgainst += (league.pointsPerGame / 2);
                                }
                            }

                            if (teamSeries.seriesTotal > otherTeamSeries.seriesTotal) {
                                matchData.pointsFor += league.pointsPerGame;
                            } else if (teamSeries.seriesTotal < otherTeamSeries.seriesTotal) {
                                matchData.pointsAgainst += league.pointsPerGame;
                            } else {
                                matchData.pointsFor += (league.pointsPerGame / 2);
                                matchData.pointsAgainst += (league.pointsPerGame / 2);
                            }

                            data.push(matchData);
                        }

                    });

                });

                resolve(data);
            });

        };

        /**
         * Service call that will build the handicap value for each of the matches.
         * @param {bowling.League} league
         * @param {bowling.Team} team
         * @returns {*}
         */
        TeamMatchDetailService.buildHandicapData = function(league, team) {

            var deferred = $q.defer();

            d3Service.get().then(function(d3) {
                var data = [];
                var color = d3Service.baseColor();

                team.series.forEach(function (series) {

                    var s = {
                        label: series.week.weekNumber,
                        value: series.seriesHandicap,
                        color: color
                    };

                    console.log(s);

                    data.push(s);

                });

                deferred.resolve(data);
            });

            return deferred.promise;

        };

        /**
         * Service that will build the pins per match data.
         * @param league
         * @param team
         * @returns {*}
         */
        TeamMatchDetailService.buildPinsPerMatchData = function(league, team) {

            var deferred = $q.defer();

            d3Service.get().then(function(d3) {
                var data = [];
                var color = d3Service.baseColor();

                team.series.forEach(function (series) {
                    data.push({
                        label: series.week.weekNumber,
                        value: series.seriesScratch,
                        color: color
                    });
                });

                deferred.resolve(data);
            });

            return deferred.promise;
        };

        return TeamMatchDetailService;

    };

    angular.module('bowling')
        .service('TeamMatchDetailService', ['$q', 'd3Service', TeamMatchDetailService]);


}());
