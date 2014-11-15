/*
 * bowling-webapp
 * https://github.com/MeerkatLabs/bowling-visualization
 *
 * Copyright (c) 2014 Meerkat Labs
 * http://www.meerkatlabsllc.com/
 * Licensed under the MIT License
 */

/**
 * Service responsible for fetching the player data for the controllers to display.
 */

var bowlingApp = bowlingApp || angular.module('bowling');

bowlingApp.factory('PlayerDetailService', ['$q', 'd3Service', 'dataService', function($q, d3Service, dataService) {

    /**
     * Fetches the player statistics and notifies the appropriate deferred when completed.
     * @param {bowling.Player} player
     */
    var buildDataTable = function(player) {

        return $q(function(resolve, reject) {
            var data = [];

            player.serieses.forEach(function (element) {

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

            resolve(data);
        });
    };

    var findPlayer = function(teamId, playerId) {
        var deferred = $q.defer();

        dataService.getData().then(function (league) {
            var foundTeam = bowling.utils.findInArray(league.teams, function (element) {
                return teamId == element.id;
            });

            if (foundTeam === null) {
                console.error("Couldn't find team: " + $routeParams.teamId);
                return;
            }

            var foundPlayer = bowling.utils.findInArray(foundTeam.players, function (element) {
                return playerId == element.id;
            });

            if (foundPlayer === null) {
                console.error("Couldn't find team: " + $routeParams.playerId);
                return;
            }

            deferred.resolve({
                league: league,
                team: foundTeam,
                player: foundPlayer
            });
        });

        return deferred.promise;
    };

    var getScoreSheets = function(player) {
        return $q(function(resolve, reject) {

            // The data for this is going to be an array of the games for each match.
            // [{
            //    label: 'Match 1 {{date}}',
            //    games: [bowling.Game,..]
            // }, ..]
            var data = [];

            player.serieses.forEach(function (series) {
                data.push({
                    label: 'Week ' + series.week.weekNumber,
                    games: series.games
                });
            });

            resolve(data);

        });
    };

    var minMaxScores = function(player) {
        return $q(function(resolve, reject) {
            var data = {
                gameMinimum: Number.MAX_SAFE_INTEGER,
                gameMaximum: -Number.MAX_SAFE_INTEGER,
                seriesMinimum: Number.MAX_SAFE_INTEGER,
                seriesMaximum: -Number.MAX_SAFE_INTEGER
            };

            // Need to go through all of the scores in the game Series and fetch the min and max values for the games
            // and the series values.

            player.serieses.forEach(function(series) {

                series.games.forEach(function(game) {
                    data.gameMinimum = Math.min(game.score, data.gameMinimum);
                    data.gameMaximum = Math.max(game.score, data.gameMaximum);
                });

                data.seriesMinimum = Math.min(series.total, data.seriesMinimum);
                data.seriesMaximum = Math.max(series.total, data.seriesMaximum);

            });

            resolve(data);

        });
    };

    /**
     *
     * @param {bowling.Player} player
     * @returns {*}
     */
    var handicapOverTime = function(player) {
        return $q(function(resolve, reject) {

            var data = [];

            player.serieses.forEach(function(series) {
                data.push({
                    label: series.week.weekNumber,
                    value: series.total
                });
            });

            resolve(data);

        });
    };

    /**
     * Fetch all of the games that the player has participated in.
     * @param {bowling.League} league
     * @param {bowling.Team} team
     * @param {bowling.Player} player
     * @returns {*} promise
     */
    var getAllGames = function(league, team, player) {
        return $q(function (resolve, reject) {
            resolve(league.getGamesForPlayer(player));
        });
    };

    /**
     * Fetch the total first ball analysis data set.
     * @param {bowling.League} league
     * @param {bowling.Team} team
     * @param {bowling.Player} player
     * @returns {*} promise
     */
    var firstBallAnalysis = function(league, team, player) {

        var deferred = $q.defer();

        getAllGames(league, team, player).then(function(games) {

            var firstBalls = [];
            games.forEach(function (game) {

                game.frames.forEach(function (frame) {
                    firstBalls.push(frame[0]);
                });

            });

            d3Service.get().then(function(d3) {

                firstBalls.sort(d3.ascending);

                var results = {
                    mean: d3.mean(firstBalls),
                    median: d3.median(firstBalls),
                    min: d3.min(firstBalls),
                    max: d3.max(firstBalls),
                    firstQuartile: d3.quantile(firstBalls, 0.25),
                    thirdQuartile: d3.quantile(firstBalls, 0.75),
                    data: firstBalls
                };

                deferred.resolve(results);

            });

        });

        return deferred.promise;

    };

    return {
        buildDataTable: buildDataTable,
        findPlayer: findPlayer,
        getScoreSheets: getScoreSheets,
        minMaxScores: minMaxScores,
        handicapOverTime: handicapOverTime,
        firstBallAnalysis: firstBallAnalysis
    };

}]);
