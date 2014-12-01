/*
 * bowling-webapp
 * https://github.com/MeerkatLabs/bowling-visualization
 *
 * Copyright (c) 2014 Meerkat Labs
 * http://www.meerkatlabsllc.com/
 * Licensed under the MIT License
 */

/**
 * Directive that will render a graph that will show a collection of number ranges.
 */
(function() {

    var NumberRangeDirective = function(d3Service) {

        var NumberRangeDirective = {};

        NumberRangeDirective.link = function(scope, element, attrs) {

            scope.render = function (data) {

                if (!scope.data) {
                    return;
                }

                console.log("Data Valid");

                d3Service.get().then(function (d3) {

                    console.log(scope.data);

                    var svg = d3.select(element[0]);

                    var width = parseInt(svg.style('width')),
                        height = parseInt(svg.style('height'));

                    var maxValue = parseInt(attrs.maxvalue),
                        margin = parseInt(attrs.margin) || 20,
                        axisLocation = attrs.axis;

                    var gameScale = d3.scale.linear()
                        .domain([0, maxValue])
                        .range([margin, width-margin]);

                    var xAxis = d3.svg.axis()
                        .scale(gameScale)
                        .ticks(15)
                        .orient(axisLocation);

                    if (axisLocation !== "none") {
                        svg.append("g").attr("class", "x axis")
                            .attr("transform", function() {

                                var y = 50;

                                if (axisLocation === "bottom") {
                                    y = height - 70;
                                }

                                return "translate(0," + y + ")";
                            }).call(xAxis);
                    }

                    var barY = 55;

                    if (axisLocation == "bottom") {
                        barY = 5;
                    }

                    var colors = d3Service.colorScale();

                    svg.append('g')
                        .attr("transform", "translate(" + gameScale(scope.data[0]) + "," + barY + ")")
                        .append('rect')
                        .attr('width', gameScale(scope.data[1]) - gameScale(scope.data[0]))
                        .attr('height', 20)
                        .attr('fill', colors(0));

                    if (attrs.caption !== undefined) {
                        svg.append("g")
                            .attr("transform", function() {

                                var y = 25;

                                if (axisLocation === "bottom") {
                                    y = height - 25;
                                }

                                return "translate(" +(width/2) + "," + y + ")";
                            })
                            .append("text")
                                .attr("text-anchor", "middle")
                                .attr("fill", "black")
                                .text(attrs.caption);
                    }

                });

            };

            scope.$watch(function () {
                return element[0].offsetWidth;
            }, function () {
                scope.render(scope.data);
            });

            scope.$watch('data', function (newVals, oldVals) {
                return scope.render(newVals);
            }, true);

        };

        NumberRangeDirective.scope = {
            data: '='
        };

        return NumberRangeDirective;

    };

    angular.module('d3')
        .directive('numberrange', ['d3Service', NumberRangeDirective]);
}());