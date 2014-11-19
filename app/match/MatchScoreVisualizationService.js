/*
 * bowling-webapp
 * https://github.com/MeerkatLabs/bowling-visualization
 *
 * Copyright (c) 2014 Meerkat Labs
 * http://www.meerkatlabsllc.com/
 * Licensed under the MIT License
 */

/**
 * Service that will fetch the scores from a match and build the graphs for the data.
 */
(function() {

    var MatchScoreVisualizationService = function($q) {

        var MatchScoreVisualizationService = {};

        MatchScoreVisualizationService.buildScoreChart = function(league, match) {

            console.log('Starting build score chart', league, match);

            return $q(function(resolve, reject) {
                var gameCharts = [];
                for (var gameIndex = 0; gameIndex < league.gamesPerSeries; ++gameIndex) {
                    var data = [];
                    match.scores.forEach(function (teamSeries, i) {

                        data.push({
                            label: teamSeries.team.name,
                            value: teamSeries.gameTotal[gameIndex]
                        });

                    });

                    gameCharts.push(data);
                }

                var totalData = [];
                match.scores.forEach(function (teamSeries) {

                    totalData.push({
                        label: teamSeries.team.name,
                        value: teamSeries.seriesTotal
                    });

                })

                console.log('gameCharts', gameCharts);

                resolve({
                    gameCharts: gameCharts,
                    totalData: totalData
                });
            });
        };

        return MatchScoreVisualizationService;

    };

    angular.module('bowling')
        .service('MatchScoreVisualizationService', ['$q', MatchScoreVisualizationService])

}());
