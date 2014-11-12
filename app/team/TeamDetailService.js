/**
 * Service that will retrieve the data to be displayed in the team roster list.
 */

var bowlingApp = bowlingApp || angular.module('bowling');

bowlingApp.factory('TeamDetailService', ['$q', 'dataProvider',
    function($q, dataProvider) {

        var getTeamList = function(team) {

            var deferred = $q.defer();

            dataProvider.getData().then(function(league) {

                var data = [];

                team.players.forEach(function (roller) {

                    var rollerData = {
                        id: roller.id,
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

            });

            return deferred.promise;

        };

        var getMatchList = function(team) {

            var deferred = $q.defer();

            dataProvider.getData().then(function(league) {

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

            });

            return deferred.promise;
        };

        return {
            getTeamList: getTeamList,
            getMatchList: getMatchList
        };

    }]);
