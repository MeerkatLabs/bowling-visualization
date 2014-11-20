/*
 * bowling-webapp
 * https://github.com/MeerkatLabs/bowling-visualization
 *
 * Copyright (c) 2014 Meerkat Labs
 * http://www.meerkatlabsllc.com/
 * Licensed under the MIT License
 */

/**
 * Service that will fetch the team members and the statistics associated with each of the members.
 */
(function() {

    var TeamMemberDetailService = function($q) {

        var TeamMemberDetailService = {};

        /**
         * Fetch the member details for the team provided.
         * @param {bowling.League} league
         * @param {bowling.Team} team
         */
        TeamMemberDetailService.getMemberDetails = function(league, team) {

            return $q(function(resolve, reject) {
                var data = [];

                team.players.forEach(function (roller) {

                    var rollerData = {
                        id: roller.id,
                        roller: roller,
                        name: roller.name,
                        handicap: roller.handicap,
                        games: null,
                        pins: null,
                        average: roller.playerAverage,
                        hhg: null,
                        hhs: null,
                        hsg: null,
                        hss: null
                    };

                    if (roller.serieses.length > 0) {
                        rollerData.games = rollerData.pins = rollerData.hhg = rollerData.hhs = rollerData.hsg = rollerData.hss = 0;
                    }

                    roller.serieses.forEach(function (series) {

                        rollerData.games += series.games.length;

                        series.games.forEach(function (game) {
                            rollerData.pins += game.score;
                            rollerData.hhg = Math.max(rollerData.hhg, game.score + series.handicap);
                            rollerData.hsg = Math.max(rollerData.hsg, game.score);
                        });

                        rollerData.hhs = Math.max(rollerData.hhs, series.total + (series.handicap * series.games.length));
                        rollerData.hss = Math.max(rollerData.hss, series.total);
                    });

                    data.push(rollerData);

                });

                resolve(data);
            });

        };

        /**
         * Retrieve the pin detail information.
         * @param {bowling.League} league
         * @param {bowling.Team} team
         */
        TeamMemberDetailService.getMemberPinDetail = function(league, team) {

            return TeamMemberDetailService.getMemberDetails(league, team).then(function(playerData) {
                var data = [];
                playerData.forEach(function(element) {

                    data.push({
                        label: element.roller.name,
                        value: element.pins
                    });

                });
                return data;
            });

        };

        return TeamMemberDetailService;
    };

    angular.module('bowling')
        .service('TeamMemberDetailService', ['$q', TeamMemberDetailService]);

}());