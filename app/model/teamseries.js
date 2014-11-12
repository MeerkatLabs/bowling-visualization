/**
 * Created by rerobins on 11/8/14.
 */

; (function(undefined) {

    if (typeof bowling === 'undefined') {
        throw 'Cannot find bowling namespace';
    }

    /**
     * Team Series is the collection of all of the player series for a team.
     * @param {Object} seriesConfiguration
     * @param {bowling.Week} week
     * @constructor
     */
    bowling.TeamSeries = function (seriesConfiguration, week) {
        // Need to find the teams in the current league and create them if necessary.
        this.playerSeries = [];
        this.seriesTotal = 0;
        this.seriesScratch = 0;
        this.gameScratchTotal = [];
        this.gameTotal = [];
        this.seriesHandicap = 0;
        this.scoresByGame = [];
        this.week = week;

        for (var gameIndex = 0; gameIndex < bowling.currentLeague.gamesPerSeries; ++gameIndex) {
            this.gameScratchTotal[gameIndex] = 0;
            this.gameTotal[gameIndex] = 0;
            this.scoresByGame[gameIndex] = [];
        }

        this.team = bowling.utils.findInArray(bowling.currentLeague.teams, function (element) {
            return element.id == seriesConfiguration.id;
        });

        if (this.team === null) {
            this.team = new bowling.Team(seriesConfiguration);
            bowling.currentLeague.addTeam(this.team);
        }

        // Now to update the scores for the score sheet.
        // Find the roller for the score.
        seriesConfiguration.rollers.forEach(function (element) {
            var rollerId = element.id;
            var games = [];
            var roller = bowling.utils.findInArray(this.team.players, function (roller) {
                return rollerId == roller.id;
            });

            if (roller === null) {
                // See if the roller is in the sub list:
                roller = bowling.utils.findInArray(bowling.currentLeague.subs, function (roller) {
                    return rollerId == roller.id;
                });

                if (roller === null) {
                    // Now the roller has to be added to the league.
                    roller = new bowling.Player(element);
                    if (roller.type == 'substitute') {
                        bowling.currentLeague.subs.push(roller);
                    } else if (roller.type == 'regular') {
                        this.team.addPlayer(roller);
                    }
                }
            }

            element.games.forEach(function (gameConfiguration) {
                var game = new bowling.Game(gameConfiguration);
                game.roller = roller;
                games[game.gameNumber] = game;
            }, this);

            var playerSeries = new bowling.PlayerSeries(roller, games, this.week);
            this.playerSeries.push(playerSeries);

            // Add the games to the player's stats.
            roller.bowledGames = roller.bowledGames.concat(playerSeries.games);
            roller.serieses.push(playerSeries);

            // Now that the new games have been added, need to update the handicap and the average for the player
            roller.updateStats();

        }, this);

        // Update the totals.
        this.playerSeries.forEach(function (element) {
            this.seriesHandicap += element.handicap;

            for (var gameIndex = 0; gameIndex < bowling.currentLeague.gamesPerSeries; ++gameIndex) {
                this.gameScratchTotal[gameIndex] += element.games[gameIndex].score;
                this.seriesScratch += element.games[gameIndex].score;

                this.scoresByGame[gameIndex].push(element.games[gameIndex]);
            }


        }, this);

        this.seriesTotal = this.seriesScratch + (this.seriesHandicap * bowling.currentLeague.gamesPerSeries);

        for (gameIndex = 0; gameIndex < bowling.currentLeague.gamesPerSeries; ++gameIndex) {
            this.gameTotal[gameIndex] = this.gameScratchTotal[gameIndex] + this.seriesHandicap;
        }

    };

}).call(this);