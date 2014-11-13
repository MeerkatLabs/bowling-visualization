/*
 * bowling-webapp
 * https://github.com/MeerkatLabs/bowling-visualization
 *
 * Copyright (c) 2014 Meerkat Labs
 * http://www.meerkatlabsllc.com/
 * Licensed under the MIT License
 */

/**
 * League model definition.
 */
; (function (undefined) {

    /**
     * League object that contains all of the teams for the league.  Teams can be dynamically defined in each of the
     * weeks.
     * @param {Object} configuration
     * @param {string} configuration.name
     * @param {int} configuration.weeks
     * @param {Array} configuration.teams
     * @constructor
     */
    bowling.League = function (configuration) {
        this.name = configuration.name || "Unnamed League";
        this.weekCount = configuration.weekCount || 0;
        this.teams = [];
        this.subs = [];
        this.weeks = [];
        this.handicap = new bowling.HandicapRules(configuration.handicap || {});
        this.gamesPerSeries = configuration.gamesPerSeries || 3;
        this.gameLabels = [];
        this.subs = [];
        this.pointsPerGame = 2;

        for (var index = 0; index < this.gamesPerSeries; ++index) {
            this.gameLabels[index] = "" + (index + 1);
        }

        var localTeams = configuration.teams || [];

        localTeams.forEach(function (element) {
            var team = new bowling.Team(element);
            this.addTeam(team);
        }, this);
    };

    /**
     * Add a team to the league.  Will only add the team if the name is not already used by another team.
     * @param {bowling.Team} team
     */
    bowling.League.prototype.addTeam = function (team) {
        var found = false;
        this.teams.forEach(function (element) {
            if (element.name == team.name) {
                found = true;
            }
        });

        if (!found) {
            this.teams.push(team);
        }

    };


    // Install the bowling namespace into the global scope.
    if (typeof this.bowling === 'undefined') {
        throw 'bowling namespace is not defined.';
    }



}).call(this);
