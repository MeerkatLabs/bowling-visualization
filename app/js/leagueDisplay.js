/**
 * Created by rerobins on 10/31/14.
 */

// Need to have something that will load up the league definition file and then start processing the week data and
// display the results for the page.

;(function(undefined) {

    // Define the bowling namespace for the application
    var bowling = function() {};

    bowling._matchCounter = 0;
    bowling._playerCounter = 0;

    // Utiltities namespace.
    bowling.utils = function() {};

    /**
     * Find an element in an array based on the callback provided.
     * @param {Array} array
     * @param {function} callback
     * @returns {*}
     */
    bowling.utils.findInArray = function(array, callback) {

        var result = null;
        var skip = false;
        array.forEach(function(element) {
            if (!skip && callback(element)) {
                result = element;
                skip = true;
            }
        });

        return result;

    };

    /**
     * This is the current league that is being displayed/manipulated.
     * @type {bowling.League}
     */
    bowling.currentLeague = null;

    /**
     * The configuration object.
     * @type {{root: string}} location of all of the viewing data.
     */
    bowling.configuration = {
        root: 'leaguedata'
    };

    /**
     * Initialize the bowling data model.
     * @param {Object} configuration
     * @param $q Angular JS promise implementation
     * @returns angular promise.
     */
    bowling.initialize = function(configuration, $q) {

        bowling.configuration = configuration || bowling.configuration;

        var deferred = $q.defer();
        var leagueLoader = new bowling.LeagueLoader(deferred);
        leagueLoader.load();

        return deferred.promise;
    };

    /**
     * This is a loader that is responsible for loading all of the bowling data and then notifying the angular deferred
     * object when completed.
     * @param deferred deferred object.
     * @constructor
     */
    bowling.LeagueLoader = function(deferred) {
        this.deferred = deferred;
    };

    /**
     * Load the league data from the configuration details.
     */
    bowling.LeagueLoader.prototype.load = function() {

        var thisObject = this;

        var root = bowling.configuration.root;
        $.getJSON(root+'/league.json').done(function(data) {
            thisObject._handleLeagueLoad(data);
        }).error(function(error) {
            if (error.status == 200) {
                console.error("File found, but not parsable.");
            } else {
                console.error("Couldn't find week data for: " + weekNumber);
            }
        });
    };

    /**
     * Method that will handle the data that is loaded from the league file.
     * @param {Object} data
     * @param {Array} data.teams
     * @param {int} data.weeks
     * @private
     */
    bowling.LeagueLoader.prototype._handleLeagueLoad = function(data) {
        console.log('Loaded league data for: ' + data.name);
        bowling.currentLeague = new bowling.League(data);

        if (bowling.currentLeague.weekCount > 0) {
            this.loadWeek(1);
        } else {
            console.warn("League doesn't contain any week data");
        }
    };

    /**
     * Load the week data for the league.
     * @param {int} weekNumber
     */
    bowling.LeagueLoader.prototype.loadWeek = function(weekNumber) {
        console.log("Attempting to load week: " + weekNumber);
        var thisObject = this;
        $.getJSON(bowling.configuration.root+'/week'+weekNumber+'.json').done(function(data) {
            thisObject._handleWeekLoad(weekNumber, data);
        }).error(function(error) {
            if (error.status == 200) {
                console.log("File found, but not parsable.");
            } else {
                console.log("Couldn't find week data for: " + weekNumber);
            }
            console.log(error);
            thisObject.deferred.resolve(bowling.currentLeague);
        });
    };

    /**
     * Handle the loading of the week data.
     * @param {int} weekNumber
     * @param {Object} data
     * @param {Array} data.scoresheet
     * @param {string} data.date
     * @private
     */
    bowling.LeagueLoader.prototype._handleWeekLoad = function(weekNumber, data) {
        // Need to create a unique series for each of the objects that defined, then associate all of the data with
        // the appropriate team and/or player.
        var week = new bowling.Week(data, weekNumber);
        bowling.currentLeague.weeks.push(week);

        if (weekNumber + 1 <= bowling.currentLeague.weekCount) {
            this.loadWeek(weekNumber + 1);
        } else {
            this.deferred.resolve(bowling.currentLeague);
        }

    };

    /**
     * League object that contains all of the teams for the league.  Teams can be dynamically defined in each of the
     * weeks.
     * @param {Object} configuration
     * @param {string} configuration.name
     * @param {int} configuration.weeks
     * @param {Array} configuration.teams
     * @constructor
     */
    bowling.League = function(configuration) {
        this.name = configuration.name || "Unnamed League";
        this.weekCount = configuration.weekCount || 0;
        this.teams = [];
        this.subs = [];
        this.weeks = [];
        this.handicap = new bowling.HandicapRules(configuration.handicap || {});
        this.gamesPerSeries = configuration.gamesPerSeries || 3;
        this.gameLabels = [];
        this.subs = [];

        for (var index = 0; index < this.gamesPerSeries; ++index) {
            this.gameLabels[index] = "" + (index+1);
        }

        var localTeams = configuration.teams || [];

        localTeams.forEach(function(element) {
            var team = new bowling.Team(element);
            this.addTeam(team);
        }, this);
    };

    /**
     * Add a team to the league.  Will only add the team if the name is not already used by another team.
     * @param {bowling.Team} team
     */
    bowling.League.prototype.addTeam = function(team) {
        var found = false;
        this.teams.forEach(function(element) {
            if (element.name == team.name) {
                found = true;
            }
        });

        if (!found) {
            this.teams.push(team);
        }

    };

    /**
     * The handicap rules for the league.
     * @param {Object} configuration
     * @param {double} configuration.percentage
     * @param {int} configuration.maximum
     * @param {int|null} configuration.rollingLength
     * @constructor
     */
    bowling.HandicapRules = function(configuration) {
        this.percentage = configuration.percentage || 0.9;
        this.maxScore = configuration.maximum || 210;
        this.rollingLength = configuration.rollingLength || null;
    };

    bowling.HandicapRules.prototype.calculateHandicapFromAverage = function(average) {
        return Math.floor((this.maxScore - average) * this.percentage);
    };

    bowling.HandicapRules.prototype.calculateHandicapFromGames = function(games) {

    };

    /**
     * Week object that contains all of the recorded matches for the week.
     * @param {Object} weekConfiguration
     * @param {string} weekConfiguration.date
     * @param {Array} weekConfiguration.scoresheet
     * @param {int} weekNumber
     * @constructor
     */
    bowling.Week = function(weekConfiguration, weekNumber) {
        this.date = weekConfiguration.date;
        this.weekNumber = weekNumber;
        this.matches = [];

        weekConfiguration.scoresheet.forEach(function(element, iter, array) {
            var match = new bowling.Match(element, this);
            this.matches.push(match);

            match.teams.forEach(function(team, iter, teams) {
               team.series[this.weekNumber-1] = match.scores[iter];
            }, this);
        }, this);

        // After the week has been defined, update the handicaps and averages of the players.
    };

    /**
     * Team Series is the collection of all of the player series for a team.
     * @param {Object} seriesConfiguration
     * @param {bowling.Week} week
     * @constructor
     */
    bowling.TeamSeries = function(seriesConfiguration, week) {
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

        this.team = bowling.utils.findInArray(bowling.currentLeague.teams, function(element) {
           return element.id == seriesConfiguration.id;
        });

        if (this.team == null) {
            this.team = new bowling.Team(seriesConfiguration);
            bowling.currentLeague.addTeam(this.team);
        }

        // Now to update the scores for the score sheet.
        // Find the roller for the score.
        seriesConfiguration.rollers.forEach(function(element) {
            var rollerId = element.id;
            var games = [];
            var roller = bowling.utils.findInArray(this.team.players, function(roller) {
                return rollerId == roller.id;
            });

            if (roller == null) {
                // See if the roller is in the sub list:
                roller = bowling.utils.findInArray(bowling.currentLeague.subs, function(roller) {
                    return rollerId == roller.id;
                });

                if (roller == null) {
                    // Now the roller has to be added to the league.
                    roller = new bowling.Player(element);
                    if (roller.type == 'substitute') {
                        bowling.currentLeague.subs.push(roller);
                    } else if (roller.type == 'regular') {
                        this.team.addPlayer(roller);
                    }
                }
            }

            element.games.forEach(function(gameConfiguration) {
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
        this.playerSeries.forEach(function(element) {
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

    /**
     * A player series contains the games that a roller has bowled for the series.
     * @param {bowling.Player} player
     * @param {bowling.Game[]} games
     * @param {bowling.Week} week
     * @constructor
     */
    bowling.PlayerSeries = function(player, games, week) {
        this.player = player;
        this.games = games;
        this.total = 0;
        this.week = week;

        this.games.forEach(function (element) {
           this.total += element.score;
        }, this);

        this.playerAverage = 0;
        this.handicap = 0;
        this.seriesAverage = Math.floor(this.total / this.games.length);

        // Calculate the average from the games that are defined in this series
        if (player.playerAverage == null) {
            this.playerAverage = Math.floor(this.total / this.games.length);
            this.player.playerAverage = this.playerAverage;
        } else {
            this.playerAverage = this.player.playerAverage;
        }

        // Same thing with the handicap.
        if (player.handicap == null) {
            this.handicap = bowling.currentLeague.handicap.calculateHandicapFromAverage(this.playerAverage);
            this.player.handicap = this.handicap;
        } else {
            this.handicap = this.player.handicap;
        }
    };

    /**
     * Match is the scores and teams that competed against each other.
     * @param {Object} matchConfiguration
     * @param {bowling.Week} week
     * @constructor
     */
    bowling.Match = function(matchConfiguration, week) {
        this.id = bowling._matchCounter++;
        this.teams = [];
        this.scores = [];
        this.week = week;

        matchConfiguration.forEach(function (element) {
            var series = new bowling.TeamSeries(element, week);
            this.teams.push(series.team);
            this.scores.push(series);
        }, this);

    };

    /**
     * Team object that contains players for the league.
     * @param {Object} configuration
     * @param {string} configuration.id
     * @param {string} configuration.name
     * @param {boolean} configuration.visualize
     * @param {Array} configuration.rollers
     * @constructor
     */
    bowling.Team = function(configuration) {
        this.id = configuration.id;
        this.name = configuration.name || "Unnamed Team";
        this.visualize = configuration.visualize || false;
        this.players = [];
        this.series = [];

        var localPlayers = configuration.rollers || [];

        localPlayers.forEach(function(element){
            var player = new bowling.Player(element);

            if (player.type == "substitute") {
                bowling.currentLeague.subs.push(player);
            } else {
                this.addPlayer(player);
            }
        }, this);
    };

    /**
     * Add a player to the team.
     * @param {bowling.Player} player
     */
    bowling.Team.prototype.addPlayer = function(player) {
        this.players.push(player);
    };

    /**
     * Player object for each of the teams.
     * @param {Object} configuration
     * @param {string} configuration.id
     * @param {string} configuration.name
     * @param {string} configuration.memberType
     * @param {int} configuration.handicap
     * @constructor
     */
    bowling.Player = function(configuration) {
        this.id = configuration.id || "" + bowling._playerCounter++;
        configuration.id = this.id;
        this.name = configuration.name || "Unnamed Player";
        this.handicap = configuration.handicap || null;
        this.type = configuration.memberType || "regular";
        this.bowledGames = [];
        this.serieses = [];
        this.playerAverage = null;
    };

    bowling.Player.prototype.updateStats = function() {
        var total = 0;
        this.bowledGames.forEach(function (element) {
            total += element.score;
        });

        this.playerAverage = Math.floor(total / this.bowledGames.length);
        this.handicap = bowling.currentLeague.handicap.calculateHandicapFromAverage(this.playerAverage);
    };

    /**
     * Game that will be displayed.
     * @param {Object} configuration
     * @param {int} configuration.gameNumber
     * @param {int} configuration.score
     * @param {Array} configuration.frames
     * @constructor
     */
    bowling.Game = function(configuration) {
      this.score = configuration.score || null;
      this.frames = configuration.frames || null;
      this.gameNumber = configuration.gameNumber - 1;
      this.frameScore = [10];
      this.roller = null;

      // Always override the score value if the frames are defined.
      if (this.frames != null) {
          this.calculateScore();
      }
    };

    /**)
     * Calculate the score for all of the frames.
     */
    bowling.Game.prototype.calculateScore = function() {
        this.score = 0;
        this.frames.forEach(function(element, index, frames) {
            var firstBall = element[0];
            var secondBall = element[1];

            var frameScore = 0;

            if (index != 9) {
                if (firstBall == 10) {
                    // Strike, add this score plus the next two balls.
                    frameScore += 10;
                    if (frames[index+1][1] == null) {
                        frameScore += 10 + frames[index+2][0]
                    } else {
                        frameScore += frames[index+1][0] + frames[index+1][1];
                    }
                } else if (firstBall + secondBall == 10) {
                    // Spare, add this score plus the next ball.
                    frameScore += 10 + frames[index+1][0];
                } else {
                    // Just add the scores to the current score.
                    frameScore += element[0] + element[1];
                }
            } else {
                // Special rules for the 10th frame (i.e. just add the scores).
                frameScore += element[0] + element[1];
                if (element[2] != null) {
                    frameScore += element[2];
                }
            }

            this.score += frameScore;
            this.frameScore[index] = this.score;
        }, this);
    };

    // Install the bowling namespace into the global scope.
    if (typeof this.bowling !== 'undefined') {
        throw 'An object called bowling is already defined in the global scope';
    } else {
        this.bowling = bowling;
    }

}).call(this);

