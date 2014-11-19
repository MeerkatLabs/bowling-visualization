/*
 * bowling-webapp
 * https://github.com/MeerkatLabs/bowling-visualization
 *
 * Copyright (c) 2014 Meerkat Labs
 * http://www.meerkatlabsllc.com/
 * Licensed under the MIT License
 */

/**
 * Service that will find the team object.
 */
(function() {

    var TeamFindService = function($q, DataService) {

        var TeamFindService = {};

        /**
         * Find the team with the identifier provided.
         * @param {string} teamId
         * @returns {*} promise
         */
        TeamFindService.findTeam = function(teamId) {
            var deferred = $q.defer();

            DataService.getData().then(function (league) {
                var foundTeam = bowling.utils.findInArray(league.teams, function (element) {
                    return teamId == element.id;
                });

                if (foundTeam === null) {
                    console.error("Couldn't find team: " + teamId);
                    return;
                }

                deferred.resolve({
                    league: league,
                    team: foundTeam
                });
            });

            return deferred.promise;
        };

        return TeamFindService;

    };

    angular.module('bowling')
        .factory('TeamFindService', ['$q', 'DataService', TeamFindService]);

}());
