/*
 * bowling-webapp
 * https://github.com/MeerkatLabs/bowling-visualization
 *
 * Copyright (c) 2014 Meerkat Labs
 * http://www.meerkatlabsllc.com/
 * Licensed under the MIT License
 */

; (function(undefined) {

    if (typeof bowling === 'undefined') {
        throw 'Cannot find bowling namespace';
    }

    /**
     * Week object that contains all of the recorded matches for the week.
     * @param {Object} weekConfiguration
     * @param {string} weekConfiguration.date
     * @param {Array} weekConfiguration.scoresheet
     * @param {int} weekNumber
     * @constructor
     */
    bowling.Week = function (weekConfiguration, weekNumber) {
        this.date = weekConfiguration.date;
        this.weekNumber = weekNumber;
        this.matches = [];

        weekConfiguration.scoresheet.forEach(function (element, iter, array) {
            var match = new bowling.Match(element, this);
            this.matches.push(match);

            match.teams.forEach(function (team, iter, teams) {
                team.series[this.weekNumber - 1] = match.scores[iter];
            }, this);
        }, this);

        // After the week has been defined, update the handicaps and averages of the players.
    };

}).call(this);