/*
 * bowling-webapp
 * https://github.com/MeerkatLabs/bowling-visualization
 *
 * Copyright (c) 2014 Meerkat Labs
 * http://www.meerkatlabsllc.com/
 * Licensed under the MIT License
 */

/**
 * Service that will find all of the scores associated with a match variable.
 */
(function() {

    var MatchScoreSheetService = function($q) {

        var MatchScoreSheetService = {};

        MatchScoreSheetService.hasScores = function(match) {

            return $q(function(resolve, reject) {

                var hasScores = false;

                match.scores.forEach(function (teamSeries) {
                    if (!hasScores) {
                        teamSeries.playerSeries.forEach(function (playerSeries) {
                            if (!hasScores) {
                                playerSeries.games.forEach(function (game) {
                                    if (!hasScores) {
                                        if (Array.isArray(game.frames) && game.frames.length == 10) {
                                            hasScores = true;
                                        }
                                    }
                                });
                            }
                        });
                    }
                });

                resolve({
                    hasScores: hasScores
                });
            });

        };

        return MatchScoreSheetService;

    };

    angular.module('bowling')
        .factory('MatchScoresService', ['$q', MatchScoreSheetService])

}());