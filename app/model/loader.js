/*
 * bowling-webapp
 * https://github.com/MeerkatLabs/bowling-visualization
 *
 * Copyright (c) 2014 Meerkat Labs
 * http://www.meerkatlabsllc.com/
 * Licensed under the MIT License
 */

/**
 * Loader that will use a promise to create the data model for the objects.
 */
; (function(undefined) {

    if (typeof bowling === 'undefined') {
        throw 'Cannot find bowling namespace.';
    }

    /**
     * This is a loader that is responsible for loading all of the bowling data and then notifying the angular deferred
     * object when completed.
     * @param deferred deferred object.
     * @constructor
     */
    bowling.LeagueLoader = function (deferred) {
        this.deferred = deferred;
    };

    /**
     * Load the league data from the configuration details.
     */
    bowling.LeagueLoader.prototype.load = function () {

        var thisObject = this;

        var root = bowling.configuration.root;
        $.getJSON(root + '/league.json').done(function (data) {
            thisObject._handleLeagueLoad(data);
        }).error(function (error) {
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
    bowling.LeagueLoader.prototype._handleLeagueLoad = function (data) {
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
    bowling.LeagueLoader.prototype.loadWeek = function (weekNumber) {
        console.log("Attempting to load week: " + weekNumber);
        var thisObject = this;
        $.getJSON(bowling.configuration.root + '/week' + weekNumber + '.json').done(function (data) {
            thisObject._handleWeekLoad(weekNumber, data);
        }).error(function (error) {
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
    bowling.LeagueLoader.prototype._handleWeekLoad = function (weekNumber, data) {
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

}).call(this);
