/*
 * bowling-webapp
 * https://github.com/MeerkatLabs/bowling-visualization
 *
 * Copyright (c) 2014 Meerkat Labs
 * http://www.meerkatlabsllc.com/
 * Licensed under the MIT License
 */

/**
 * Service that will retrieve the data to be displayed in the team roster list.
 */
(function() {

    var TeamDetailService = function($q, PlayerDetailService) {

        var TeamDetailService = {};

        /**
         * Service method that will determine the open/close statistics for the team.
         * @param {bowling.League} league
         * @param {bowling.Team} team
         * @returns {*}
         */
        TeamDetailService.getTeamOpenCloseAnalysis = function(league, team) {

            var deferred = $q.defer();

            var promises = [];
            team.players.forEach(function(player) {
                promises.push(PlayerDetailService.getOpenCloseStatistics(league, team, player));
            });

            $q.all(promises).then(function (data) {

                var returnValue = {
                    strikes: 0,
                    spares: 0,
                    open: 0,
                    total: 0
                };

                data.forEach(function (result) {
                    returnValue.strikes += result.strikes;
                    returnValue.spares += result.spares;
                    returnValue.open += result.open;
                    returnValue.total += result.total;
                });

                deferred.resolve(returnValue);
            });

            return deferred.promise;

        };

        return TeamDetailService;

    };

    angular.module('bowling')
        .factory('TeamDetailService', ['$q', 'PlayerDetailService', TeamDetailService]);
}());