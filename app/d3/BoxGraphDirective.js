/*
 * bowling-webapp
 * https://github.com/MeerkatLabs/bowling-visualization
 *
 * Copyright (c) 2014 Meerkat Labs
 * http://www.meerkatlabsllc.com/
 * Licensed under the MIT License
 */

/**
 * Directive responsible for drawing the box graph.
 */
(function() {
    angular.module('d3')
        .directive('boxgraph', ['d3Service', function(d3Service) {

            console.log("initializing box graph");

            var link = function(scope, element, attr) {

                scope.render = function(data) {

                    if (!scope.data) {
                        return;
                    }

                    d3Service.get().then(function (d3) {

                        var svg = d3.select(element[0]);

                        var width = parseInt(svg.style('width')),
                            height = parseInt(svg.style('height'));

                        var xScale = d3.scale.linear()
                            .domain([0,10])
                            .range([0,width]);

                        var boxGraphic = svg.append('g');

                        var boxTop = height*0.1;
                        var boxBottom = height*0.9;

                        boxGraphic.append('rect')
                            .attr('y', boxTop)
                            .attr('x', function() {
                                return xScale(data.firstQuartile);
                            }).attr('width', function() {
                                return xScale(data.thirdQuartile - data.firstQuartile);
                            }).attr('height', boxBottom - boxTop)
                            .attr('stroke', 'black')
                            .attr('fill', 'none');

                        // Minimum Whisker
                        svg.append("path")
                            .attr("d", d3.svg.line()
                                .x(function(d) {
                                    return xScale(d);
                                }).y(height*0.5)([data.min, data.firstQuartile]))
                            .attr("stroke", "black")
                            .attr("stroke-width", 1);

                        // Maximum Whisker
                        svg.append("path")
                            .attr("d", d3.svg.line()
                                .x(function(d) {
                                    return xScale(d);
                                }).y(height*0.5)([data.max, data.thirdQuartile]))
                            .attr("stroke", "black")
                            .attr("stroke-width", 1);

                        // Median Whisker
                        svg.append("path")
                            .attr("d", d3.svg.line()
                                .x(function(d) {
                                    return xScale(data.median);
                                }).y(function(d) { return d; })([height*0.1, height*0.9]))
                            .attr("stroke", "black")
                            .attr("stroke-width", 1);
                    });

                };

                scope.$watch(function() {
                    return element[0].offsetWidth;
                }, function() {
                    scope.render(scope.data);
                });

                scope.$watch('data', function (newVals, oldVals) {
                    return scope.render(newVals);
                }, true);

            };

            return {
                link: link,
                scope: {
                    data: "="
                }
            };

        }]);
}());