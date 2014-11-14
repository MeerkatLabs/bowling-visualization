/*
 * bowling-webapp
 * https://github.com/MeerkatLabs/bowling-visualization
 *
 * Copyright (c) 2014 Meerkat Labs
 * http://www.meerkatlabsllc.com/
 * Licensed under the MIT License
 */

/**
 * Controller that will build the lines for the chart displaying the match data.
 */

var bowlingApp = bowlingApp || angular.module('bowling');

bowlingApp.controller('PlayerMatchLineGraphCtrl', ['$scope', 'd3Service', function ($scope, d3Service) {

    $scope.$on(bowling.events.player.found, function(event, data) {
        d3Service.get().then(function (d3) {

            var lines = [];

            data.league.gameLabels.forEach(function(element, index) {
                var gameLine = d3.svg.line()
                    .x(function (d) {
                        return d.weekNumber;
                    }).y(function (d) {
                        return d.data.games[index];
                    })
                    .interpolate("linear");

                lines.push({
                    line: gameLine,
                    label: "Game " + element
                });
            });

            var incomingAverageLine = d3.svg.line()
                .x(function (d) {
                    return d.weekNumber;
                })
                .y(function (d) {
                    return d.data.incomingAverage;
                })
                .interpolate("linear");

            lines.push({

                line: incomingAverageLine,
                    label: 'Incoming Average'

            });

            var average = d3.svg.line()
                .x(function (d) {
                    return d.weekNumber;
                }).y(function (d) {
                    return d.data.average;
                })
                .interpolate("linear");

            lines.push({
                line: average,
                label: 'Series Average'
            });

            $scope.lines = lines;
        });
    });

}]);
