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

    return {
        buildDataTable: buildDataTable,
        findPlayer: findPlayer,
        getScoreSheets: getScoreSheets
    }

}]);
