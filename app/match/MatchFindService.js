/*
 * bowling-webapp
 * https://github.com/MeerkatLabs/bowling-visualization
 *
 * Copyright (c) 2014 Meerkat Labs
 * http://www.meerkatlabsllc.com/
 * Licensed under the MIT License
 */

/**
 * Service that is responsible for fetching the match that is being requested by the route.
 */
(function() {

    var MatchFindService = function($q, DataService) {

        var MatchFindService = {};

        MatchFindService.findMatch = function(matchId) {

            var deferred = $q.defer();

            DataService.getData().then(function (league) {

                var foundMatch = null;

                league.weeks.forEach(function (week) {
                    if (foundMatch == null) {
                        week.matches.forEach(function (match) {
                            if (foundMatch == null && match.id == matchId) {
                                foundMatch = match;
                            }
                        });
                    }
                });

                if (foundMatch != null) {
                    deferred.resolve({
                        league: league,
                        match: foundMatch
                    });
                } else {
                    deferred.reject();
                }
            });

            return deferred.promise;
        };

        return MatchFindService;
    };

    angular.module('bowling')
        .factory('MatchFindService', ['$q', 'DataService', MatchFindService])

}());
