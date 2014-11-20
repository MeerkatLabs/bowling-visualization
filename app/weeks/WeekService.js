/*
 * bowling-webapp
 * https://github.com/MeerkatLabs/bowling-visualization
 *
 * Copyright (c) 2014 Meerkat Labs
 * http://www.meerkatlabsllc.com/
 * Licensed under the MIT License
 */

/**
 * Service that will fetch all of the weeks from the data storage.
 */
(function() {

    /**
     * Week Service that will provide a list of the weeks that are represented by this league.
     * @param $q
     * @param DataService
     * @returns {{}}
     * @constructor
     */
    var WeekService = function($q, DataService) {

        var WeekService = {};

        var SPLIT_SIZE = 3;

        /**
         * Fetches the weeks from the league data that was loaded by the DataService.
         *
         * Promise Returns: {
         *  league: the league object that is being queried.
         *  weeks: the weeks that are contained in the league
         *  splits: an array of arrays that contain the weeks, but split on SPLIT_SIZE.
         * }
         * @returns {*} promise.
         */
        WeekService.getWeeks = function() {

            var deferred = $q.defer();

            DataService.getData().then(function (league) {

                var leagueWeeks = league.weeks.concat();
                var split = [];
                while (leagueWeeks.length > 0) {
                    split.push(leagueWeeks.splice(0, SPLIT_SIZE));
                }

                deferred.resolve({
                    splits: split,
                    league: league,
                    weeks: league.weeks
                });

            });

            return deferred.promise;

        };

        return WeekService;

    };

    angular.module('bowling')
        .service('WeekService', ['$q', 'DataService', WeekService]);

}());
