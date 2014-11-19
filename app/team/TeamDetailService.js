/*
 * bowling-webapp
 * https://github.com/MeerkatLabs/bowling-visualization
 *
 * Copyright (c) 2014 Meerkat Labs
 * http://www.meerkatlabsllc.com/
 * Licensed under the MIT License
 */

/**
 * Service that will retrieve the data to be displayed in the team roster list.
 */
angular.module('bowling').factory('TeamDetailService', ['$q', 'DataService', 'PlayerDetailService',
    function($q, DataService, PlayerDetailService) {

        /**
         * Promise listener that will notify will build the team member table, and then notify the correct promise
         * when completed.
         * @param {bowling.League} league
         * @param {bowling.Team} team
         * @param {promise} deferred
         */
        var buildTeamList = function(league, team, deferred) {
            var data = [];

            team.players.forEach(function (roller) {

                var rollerData = {
                    id: roller.id,
                    roller: roller,
                    name: roller.name,
                    handicap: roller.handicap,
                    games: null,
                    pins: null,
                    average: roller.playerAverage,
                    hhg: null,
                    hhs: null,
                    hsg: null,
                    hss: null
                };

                if (roller.serieses.length > 0) {
                    rollerData.games = rollerData.pins = rollerData.hhg = rollerData.hhs = rollerData.hsg = rollerData.hss = 0;
                }

                roller.serieses.forEach(function (series) {

                    rollerData.games += series.games.length;

                    series.games.forEach(function (game) {
                        rollerData.pins += game.score;
                        rollerData.hhg = Math.max(rollerData.hhg, game.score + series.handicap);
                        rollerData.hsg = Math.max(rollerData.hsg, game.score);
                    });

                    rollerData.hhs = Math.max(rollerData.hhs, series.total + (series.handicap * series.games.length));
                    rollerData.hss = Math.max(rollerData.hss, series.total);
                });

                data.push(rollerData);

            });

            deferred.resolve(data);
        };

        /**
         * Promise listener that will notify when the data for the team's matches has been compiled.
         * @param {bowling.League} league
         * @param {bowling.Team} team
         * @param {promise} deferred
         */
        var buildMatchData = function(league, team, deferred) {

            var data = [];

            league.weeks.forEach(function(week) {

                week.matches.forEach(function(match) {

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

            deferred.resolve(data);

        };

        /**
         *
         * @param {bowling.League} league
         * @param {bowling.Team} team
         * @returns {*}
         */
        var buildHandicapData = function(league, team) {

            return $q(function (resolve, reject) {
                var data = [];

                team.series.forEach(function (series) {

                    data.push({
                        label: series.week.weekNumber,
                        value: series.seriesHandicap
                    });

                });

                resolve(data);
            });

        };

        var buildPinsPerWeekData = function(league, team) {
            return $q(function(resolve, reject) {
                var data = [];

                team.series.forEach(function (series) {
                    data.push({
                        label: series.week.weekNumber,
                        value: series.seriesScratch
                    });
                });

                resolve(data);
            });
        };

        var getTeamOpenCloseAnalysis = function(league, team) {

            var deferred = $q.defer();

            var promises = [];
            team.players.forEach(function(player) {
                promises.push(PlayerDetailService.getOpenCloseStatistics(league, team, player));
            });

            $q.all(promises).then(function (data) {
                console.log(data);
                var returnValue = {
                    strikes: 0,
                    spares: 0,
                    open: 0,
                    total: 0
                };
                data.forEach(function (result) {
                    returnValue.strikes += result.strikes;
                    returnValue.spares += result.spares;
                    returnValue.open += result.open;
                    returnValue.total += result.total;
                });

                deferred.resolve(returnValue);
            });

            return deferred.promise;

        };

        return {

            getHandicapPerWeek: buildHandicapData,
            buildPinsPerWeekData: buildPinsPerWeekData,

            /**
             * Will asynchronously fetch the members of a team, and their statistics for the league.
             *
             * Data contains:
             *   id: roller.id,
             *   name: roller.name,
             *   handicap: roller.handicap,
             *   games: null,
             *   pins: null,
             *   average: roller.playerAverage,
             *   hhg: null,
             *   hhs: null,
             *   hsg: null,
             *   hss: null
             *
             * @param {bowling.Team} team
             * @returns {Array}
             */
            getTeamList: function(team) {

                var deferred = $q.defer();

                DataService.getData().then(function(league) {
                    buildTeamList(league, team, deferred);
                });

                return deferred.promise;

            },

            /**
             * Will asynchronously fetch the matches and statistics for the matches that this team has participated in.
             *
             * Data Contains:
             *   weekNumber: week.weekNumber,
             *   date: week.date,
             *   opponent: "",
             *   pointsFor: 0,
             *   pointsAgainst: 0,
             *   matchId: match.id
             * @param {bowling.Team} team
             * @returns {Array}
             */
            getMatchList: function(team) {
                var deferred = $q.defer();

                DataService.getData().then(function(league) {
                    buildMatchData(league, team, deferred);
                });

                return deferred.promise;
            },

            getPinData: function(team) {
                var deferred = $q.defer();

                DataService.getData().then(function(league) {
                    buildTeamList(league, team, deferred);
                });

                return deferred.promise.then(function(playerData) {
                    var data = [];
                    playerData.forEach(function(element) {

                        data.push({
                            label: element.roller.name,
                            value: element.pins
                        });

                    });
                    return data;
                });
            },
            getTeamOpenCloseAnalysis: getTeamOpenCloseAnalysis
        };

    }]);
