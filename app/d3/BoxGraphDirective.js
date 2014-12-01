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

    var BoxGraphDirective = function(d3Service) {
        var BoxGraphDirective = {};

        BoxGraphDirective.link = function(scope, element, attr) {

            scope.render = function(data) {

                if (!scope.data) {
                    return;
                }

                d3Service.get().then(function (d3) {

                    var svg = d3.select(element[0]);

                    var width = parseInt(svg.style('width')),
                        height = parseInt(svg.style('height'));

                    var margin = 10;

                    if (attr.margin !== undefined) {
                        margin = parseInt(attr.margin);
                    }

                    var xScale = d3.scale.linear()
                        .domain([0,10])
                        .range([margin,width-(2*margin)]);

                    var boxGraphic = svg.append('g');

                    var boxTop = height*0.4;
                    var boxBottom = height*0.6;

                    boxGraphic.append('rect')
                        .attr('y', boxTop)
                        .attr('x', function() {
                            return xScale(data.firstQuartile);
                        }).attr('width', function() {
                            return xScale(data.thirdQuartile) - xScale(data.firstQuartile);
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
                            }).y(height*0.5)([data.thirdQuartile, data.max]))
                        .attr("stroke", "black")
                        .attr("stroke-width", 1);

                    // Median Whisker
                    svg.append("path")
                        .attr("d", d3.svg.line()
                            .x(function(d) {
                                return xScale(data.median);
                            }).y(function(d) { return d; })([height*0.35, height*0.65]))
                        .attr("stroke", "blue")
                        .attr("stroke-width", 2);

                    // Axis creation for the box graph.
                    var xAxis = d3.svg.axis()
                        .scale(xScale)
                        .orient("bottom");

                    svg.append("g").attr("class", "x axis")
                        .attr("transform", "translate(0," + (height-30) + ")")
                        .call(xAxis);

                    // Add the symbol.
                    svg.append("path")
                        .attr("transform", "translate(" + xScale(data.mean) + "," + (height*0.5) + ")")
                        .attr("d", d3.svg.symbol().type('diamond')())
                        .attr("stroke", "red")
                        .attr("fill", "none");


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

        BoxGraphDirective.scope = {
            data: '='
        };

        return BoxGraphDirective;
    };

    angular.module('d3')
        .directive('boxgraph', ['d3Service', BoxGraphDirective]);
}());