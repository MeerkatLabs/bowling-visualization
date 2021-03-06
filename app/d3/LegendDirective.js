/*
 * bowling-webapp
 * https://github.com/MeerkatLabs/bowling-visualization
 *
 * Copyright (c) 2014 Meerkat Labs
 * http://www.meerkatlabsllc.com/
 * Licensed under the MIT License
 */
(function() {

    var LegendDirective = function(d3Service) {

        var LegendDirective = {};

        LegendDirective.link = function (scope, element, attrs) {

            scope.render = function() {

                if (!scope.lines) {
                    return;
                }

                d3Service.get().then(function (d3) {

                    var parent = d3.select(element[0]);

                    var colors = d3Service.colorScale();

                    parent.selectAll('div')
                        .data(scope.lines)
                        .enter()
                        .append('div')
                        .append('span')
                        .text(function(d) {
                            return d.label;
                        }).style("color", function(d,i) {
                            return colors(i);
                        }).style("font-weight", "bold");
                });

            };


            scope.$watch('lines', function (newVals, oldVals) {
                return scope.render(newVals);
            }, true);

        };

        LegendDirective.scope = {
            lines: '='
        };

        return LegendDirective;

    };

    angular.module('d3')
        .directive('legend',  ['d3Service', LegendDirective]);
}());