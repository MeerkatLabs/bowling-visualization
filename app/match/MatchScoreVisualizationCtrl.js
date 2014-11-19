/*
 * bowling-webapp
 * https://github.com/MeerkatLabs/bowling-visualization
 *
 * Copyright (c) 2014 Meerkat Labs
 * http://www.meerkatlabsllc.com/
 * Licensed under the MIT License
 */

/**
 * Match Score Visualization Controller.
 */
(function() {

    var MatchScoreVisualizationCtrl = function($scope, MatchScoreVisualizationService, matchEvents) {

        var controller = this;

        $scope.$on(matchEvents.found, function(event, data) {

            console.log('received', event, data);

            MatchScoreVisualizationService.buildScoreChart(data.league, data.match).then(function (data) {

                controller.gameCharts = data.gameCharts;
                controller.totalData = data.totalData;

            });

        });

    };

    angular.module('bowling')
        .controller('MatchScoreVisualizationCtrl',
                    ['$scope', 'MatchScoreVisualizationService', 'matchEvents', MatchScoreVisualizationCtrl]);

}());
