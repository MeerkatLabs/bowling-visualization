/**
 * Created by rerobins on 11/8/14.
 */

; (function(undefined) {

    if (typeof bowling === 'undefined') {
        throw 'Cannot find bowling namespace';
    }

    /**
     * Number that is used to generate unique match ids for the application.
     * @type {number}
     * @private
     */
    bowling._matchCounter = 0;

    /**
     * Match is the scores and teams that competed against each other.
     * @param {Object} matchConfiguration
     * @param {bowling.Week} week
     * @constructor
     */
    bowling.Match = function (matchConfiguration, week) {
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

}).call(this);