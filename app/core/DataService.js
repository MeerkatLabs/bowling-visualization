/*
 * bowling-webapp
 * https://github.com/MeerkatLabs/bowling-visualization
 *
 * Copyright (c) 2014 Meerkat Labs
 * http://www.meerkatlabsllc.com/
 * Licensed under the MIT License
 */

(function() {
    /**
     * Data Service is responsible for retrieving the data from the data store directory.
     * @param {Object} configuration
     * @param {string} configuration.root the location of the data files.
     * @param {Object} $q
     * @param {Object} $http
     * @constructor
     */
    function DataService(configuration, $q, $http) {
        var deferred = null;
        var myConfiguration = configuration;

        /**
         * Load the league data and results.
         * @returns {*} promise
         */
        this.getData = function() {
            return deferred.promise;
        };

        /**
         * Return the configuration object.
         * @returns {{root: string}}
         */
        this.getConfiguration = function() {
            return myConfiguration;
        };

        /**
         * Load the league data from the configuration details.
         */
        this.load = function () {

            deferred = $q.defer();

            var service = this;

            var root = this.getConfiguration().root;
            $http.get(root + '/league.json').success(function (data) {
                service._handleLeagueLoad(data);
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
        this._handleLeagueLoad = function (data) {
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
        this.loadWeek = function (weekNumber) {
            console.log("Attempting to load week: " + weekNumber);
            var service = this;
            $http.get(this.getConfiguration().root + '/week' + weekNumber + '.json').success(function (data) {
                service._handleWeekLoad(weekNumber, data);
            }).error(function (error) {
                if (error.status == 200) {
                    console.log("File found, but not parsable.");
                } else {
                    console.log("Couldn't find week data for: " + weekNumber);
                }
                console.log(error);
                deferred.resolve(bowling.currentLeague);
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
        this._handleWeekLoad = function (weekNumber, data) {
            // Need to create a unique series for each of the objects that defined, then associate all of the data with
            // the appropriate team and/or player.
            var week = new bowling.Week(data, weekNumber);
            bowling.currentLeague.weeks.push(week);

            if (weekNumber + 1 <= bowling.currentLeague.weekCount) {
                this.loadWeek(weekNumber + 1);
            } else {
                deferred.resolve(bowling.currentLeague);
            }

        };

        this.load();

    }

    /**
     * Data Provider definition.
     * @constructor
     */
    function DataProvider() {
        // Default configuration object.
        var configuration = {
            // data root directory.
            root: 'data'
        };

        // Provide the configuration object for the data service.
        this.configure = function(value) {
            configuration = value;
        };

        // This actually creates the data service with the promise API and the configuration object.
        this.$get = ['$q', '$http', function ($q, $http) {
            return new DataService(configuration, $q, $http);
        }];
    }

    /**
     * Provider that allows for configuration of the bowling data model.
     */
    angular.module('bowling').provider('DataService', DataProvider);
}());