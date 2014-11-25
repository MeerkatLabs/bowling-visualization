/*
 * bowling-webapp
 * https://github.com/MeerkatLabs/bowling-visualization
 *
 * Copyright (c) 2014 Meerkat Labs
 * http://www.meerkatlabsllc.com/
 * Licensed under the MIT License
 */
(function() {

    var LineGraphDirective = function(d3Service) {

        var LineGraphDirective = {};

        LineGraphDirective.link = function(scope, element, attrs) {

            scope.render = function (data) {
                d3Service.get().then(function(d3) {

                    if (!scope.lines || !scope.data) {
                        return;
                    }

                    if (!scope.margin) {
                        scope.margin = 0;
                    }

                    var svg = d3.select(element[0]);
                    var colors = d3Service.colorScale();
                    var property;

                    // Determine the domain and range for scaling the data.
                    var xDomain = [Number.MAX_VALUE, 0];
                    var yDomain = [Number.MAX_VALUE, 0];

                    // Need to find the max and min values.
                    scope.lines.forEach(function (element) {
                        scope.data.forEach(function(data) {
                            var x = element.line.x()(data);
                            xDomain[0] = Math.min(xDomain[0], x);
                            xDomain[1] = Math.max(xDomain[1], x);

                            var y = element.line.y()(data);
                            yDomain[0] = Math.min(yDomain[0], y);
                            yDomain[1] = Math.max(yDomain[1], y);
                        });
                    });

                    if (scope.xdomain) {
                        xDomain = scope.xdomain;
                    }

                    var xScale = d3.scale.linear()
                        .domain(xDomain)
                        .range([scope.margin, parseInt(svg.style("width")) - scope.margin]);

                    if (scope.ydomain) {
                        yDomain = scope.ydomain;
                    }

                    var yScale = d3.scale.linear()
                        .domain(yDomain)
                        .range([parseInt(svg.style("height")) - scope.margin, scope.margin]);

                    var xAxis = d3.svg.axis()
                        .scale(xScale)
                        .orient("bottom");

                    var yAxis = d3.svg.axis()
                        .scale(yScale)
                        .orient("left");

                    svg.append("g").attr("class", "x axis")
                        .attr("transform", "translate(0," + (parseInt(svg.style("height"))-scope.margin) + ")")
                        .call(xAxis);

                    svg.append("g").attr("class", "y axis")
                        .attr("transform", "translate(" + scope.margin + ",0)")
                        .call(yAxis);

                    scope.lines.forEach(function (element, index) {

                        // Rebuild the line to scale based on the element that it's being placed in.
                        var scaledLine = d3.svg.line()
                            .x(function(d) {
                                return xScale(element.line.x()(d));
                            }).y(function(d) {
                                return yScale(element.line.y()(d));
                            });

                        var pathContainer = svg.append("g");

                        var path = pathContainer.append("path")
                            .attr("d", scaledLine(scope.data));

                        // Basic Attributes.
                        path.attr("stroke", colors(index))
                            .attr("stroke-width", 2)
                            .attr("fill", "none");

                        // Assign style as appropriate.
                        if (element.line !== undefined && element.line.style !== undefined) {
                            for (property in element.line.style) {
                                if (element.line.style.hasOwnProperty(property)) {
                                    path.attr(property, element.line.style[property]);
                                }
                            }
                        }

                        // Dots for the data points
                        var dots = pathContainer.selectAll("circle")
                            .data(scope.data)
                            .enter()
                            .append("circle")
                            .attr("cx", function (d) { return scaledLine.x()(d); })
                            .attr("cy", function (d) { return scaledLine.y()(d); })
                            .attr("r", 3);

                        dots.attr("stroke", d3.rgb(colors(index)).brighter())
                            .attr("stroke-width", 1)
                            .attr("fill", colors(index));

                        // Assign style as appropriate.
                        if (element.dot !== undefined && element.dot.style !== undefined) {
                            for (property in element.dot.style) {
                                if (element.dot.style.hasOwnProperty(property)) {
                                    path.attr(property, element.dot.style[property]);
                                }
                            }
                        }
                    });
                });

            };

            scope.$watch(function() {
                return element[0].offsetWidth;
            }, function() {
                scope.render(scope.data);
            });

            scope.$watch('lines', function (newVals, oldVals) {
                return scope.render(newVals);
            }, true);

        };

        LineGraphDirective.scope = {
            data: '=',
            lines: '=',
            ydomain: '=',
            xdomain: '=',
            margin: '='
        };

        return LineGraphDirective;

    };

    angular.module('d3')
        .directive('linegraph', ['d3Service', LineGraphDirective]);
}());