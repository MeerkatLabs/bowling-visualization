/*
 * bowling-webapp
 * https://github.com/MeerkatLabs/bowling-visualization
 *
 * Copyright (c) 2014 Meerkat Labs
 * http://www.meerkatlabsllc.com/
 * Licensed under the MIT License
 */

(function() {

    var DifferenceGraphDirective = function(d3Service) {

        var DifferenceGraphDirective = {};

        DifferenceGraphDirective.link = function(scope, element, attrs) {

            scope.render = function (data) {

                if (!scope.data.length) {
                    return;
                }

                d3Service.get().then(function (d3) {

                    var minimumBarCount = 0;

                    if (attrs.minimumbarcount !== undefined) {
                        minimumBarCount = parseInt(attrs.minimumbarcount);
                    }

                    var barCount = Math.max(minimumBarCount, scope.data.length);

                    var margin = 20;
                    if (attrs.margin !== undefined) {
                        margin = parseInt(attrs.margin);
                    }

                    var svg = d3.select(element[0]);

                    var width = parseInt(svg.style("width")),
                        height = parseInt(svg.style("height")) - (margin * 2),
                        barHeight = height / barCount;

                    var xDomain = [0, 0, 0];

                    scope.data.forEach(function (element) {
                        var x = Math.abs(element.data.averageDifference);
                        xDomain[2] = Math.max(xDomain[2], x);
                        xDomain[0] = -xDomain[2];
                    });

                    var xScale = d3.scale.linear()
                        .domain(xDomain)
                        .range([margin, (width/2), width-margin]);

                    console.log('xScaleRange', xScale.range());

                    var xAxis = d3.svg.axis()
                        .scale(xScale)
                        .orient("bottom");

                    svg.append("path")
                        .attr("d", d3.svg.line()
                            .x(function(d) {
                                console.log('0 line:', xScale(0));
                                return xScale(0);
                            }).y(function(d) {
                                return d;
                            })([margin, height+margin]))
                        .attr("stroke", "black")
                        .attr("stroke-width", 1);

                    var bar = svg.selectAll("g")
                        .data(scope.data)
                        .enter().append("g")
                        .attr("transform", function(d, i) {
                            var height = (i * barHeight + margin);
                            var location = xScale(0);

                            if (d.data.averageDifference < 0) {
                                location = xScale(d.data.averageDifference);
                            }
                            return "translate(" + location + "," + height + ")";
                        });

                    bar.append("rect")
                        .attr("width", function(d) {
                            return Math.abs(xScale(d.data.averageDifference) - (width/2));
                        })
                        .attr("height", barHeight - 1)
                        .style("fill", function(d) {
                            if (d.data.averageDifference < 0) {
                                return "red";
                            } else {
                                return "green";
                            }
                        });

                    svg.append("g").attr("class", "x axis")
                        .attr("transform", "translate(0," + (height+margin) + ")")
                        .call(xAxis);

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

        DifferenceGraphDirective.scope = {
            data: '='
        };

        return DifferenceGraphDirective;

    };

    angular.module('d3')
        .directive('differencegraph', ['d3Service', DifferenceGraphDirective]);
}());