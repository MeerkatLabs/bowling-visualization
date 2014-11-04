/**
 * Created by rerobins on 10/31/14.
 */

// Need to have something that will load up the league definition file and then start processing the week data and
// display the results for the page.

;(function(undefined) {

    // Define the bowling namespace for the application
    var bowling = function() {};

    bowling._matchCounter = 0;

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
        }).error(function() {
            console.log("Couldn't find week data for: " + weekNumber);
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
        console.log("Loaded for week: " + weekNumber);
        console.log(data);

        // Need to create a unique series for each of the objects that defined, then associate all of the data with
        // the appropriate team and/or player.
        var week = new bowling.Week(data, weekNumber);
        bowling.currentLeague.weeks.push(week);

        if (weekNumber + 1 < bowling.currentLeague.weekCount) {
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
            var match = new bowling.Match(element);
            this.matches.push(match);

            match.teams.forEach(function(team, iter, teams) {
               team.series[this.weekNumber-1] = match.scores[iter];
            }, this);
        }, this);
    };

    /**
     * Team Series is the collection of all of the player series for a team.
     * @param {Object} seriesConfiguration
     * @constructor
     */
    bowling.TeamSeries = function(seriesConfiguration) {
        // Need to find the teams in the current league and create them if necessary.
        this.playerSeries = [];
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

            element.games.forEach(function(gameConfiguration) {
               var game = new bowling.Game(gameConfiguration);
               games[game.gameNumber] = game;
            }, this);

            var playerSeries = new bowling.PlayerSeries(roller, games);
            this.playerSeries.push(playerSeries);

            roller.bowledGames = roller.bowledGames.concat(playerSeries.games);

        }, this);

    };

    /**
     * A player series contains the games that a roller has bowled for the series.
     * @param {bowling.Player} player
     * @param {bowling.Game[]} games
     * @constructor
     */
    bowling.PlayerSeries = function(player, games) {
        this.player = player;
        this.games = games;
    };

    /**
     * Match is the scores and teams that competed against each other.
     * @param {Object} matchConfiguration
     * @constructor
     */
    bowling.Match = function(matchConfiguration) {
        this.id = bowling._matchCounter++;
        this.teams = [];
        this.scores = [];

        matchConfiguration.forEach(function (element) {
            var series = new bowling.TeamSeries(element);
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
            this.addPlayer(player);
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
        this.id = configuration.id;
        this.name = configuration.name || "Unnamed Player";
        this.handicap = configuration.handicap || null;
        this.type = configuration.memberType || "regular";
        this.bowledGames = [];
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

      // Always override the score value if the frames are defined.
      if (frames != null) {
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

            if (index != 9) {
                if (firstBall == 10) {
                    // Strike, add this score plus the next two balls.
                    this.score += 10;
                    if (frames[index+1][1] == null) {
                        this.score += 10 + frames[index+2][0]
                    } else {
                        this.score += frames[index+1][0] + frames[index+1][1];
                    }
                } else if (firstBall + secondBall == 10) {
                    // Spare, add this score plus the next ball.
                    this.score += 10 + frames[index+1][0];
                } else {
                    // Just add the scores to the current score.
                    this.score += element[0] + element[1];
                }
            } else {
                // Special rules for the 10th frame (i.e. just add the scores).
                this.score += element[0] + element[1];
                if (element[2] != null) {
                    this.score += element[2];
                }
            }
        }, this);
    };

    // Install the bowling namespace into the global scope.
    if (typeof this.bowling !== 'undefined') {
        throw 'An object called bowling is already defined in the global scope';
    } else {
        this.bowling = bowling;
    }

}).call(this);

