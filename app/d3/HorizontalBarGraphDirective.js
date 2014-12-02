/*
 * bowling-webapp
 * https://github.com/MeerkatLabs/bowling-visualization
 *
 * Copyright (c) 2014 Meerkat Labs
 * http://www.meerkatlabsllc.com/
 * Licensed under the MIT License
 */

/**
 * Created by rerobins on 11/14/14.
 */
(function() {
    var HorizBarGraphDirective = function(d3Service) {

        var HorizBarGraphDirective = {};

        HorizBarGraphDirective.link = function(scope, element, attrs) {

            scope.render = function() {
                if (!scope.data) {
                    return;
                }

                d3Service.get().then(function (d3) {
                    var svg = d3.select(element[0]);
                    var height = parseInt(svg.style('height')),
                        width = parseInt(svg.style('width'));

                    var barWidth = width / scope.data.length;

                    if (attrs.maximumbarwidth !== undefined) {
                        barWidth = Math.min(barWidth, parseInt(attrs.maximumbarwidth));
                    }

                    var maximumRange = scope.data.length;

                    if (attrs.maximumrange !== undefined) {
                        maximumRange = parseInt(attrs.maximumrange);
                    }

                    var xScale = d3.scale.linear()
                        .domain([0, maximumRange])
                        .range([50, (maximumRange * barWidth)]);

                    var yScale = d3.scale.linear()
                        .domain([0, d3.max(scope.data, function(d) {
                            return d.value;
                        })]).range([height-40, 10]);

                    var colors = d3Service.colorScale();

                    var bar = svg.selectAll('g')
                        .data(scope.data)
                        .enter().append("g")
                        .attr("transform", function(d, i) {

                            console.log("transform:", d);

                            var location = xScale(d.label) - ((barWidth-5) / 2);

                            console.log(" location:", location);

                            return "translate(" + location + "," + (yScale(d.value)) + ")";
                        });

                    bar.append("rect")
                        .attr("width", barWidth - 5)
                        .attr("height", function(d) {
                            return (height - 40) - yScale(d.value);
                        })
                        .style("fill", function(d,i) {
                            if (d.color === undefined) {
                                return colors(i);
                            } else {
                                console.log("render", d.color);
                                return d.color;
                            }
                        });

                    var yAxis = d3.svg.axis()
                        .scale(yScale)
                        .orient("left");

                    svg.append("g").attr("class", "y axis")
                        .attr("transform", "translate(50,0)")
                        .call(yAxis);

                    var xAxis = d3.svg.axis()
                        .scale(xScale)
                        .orient("bottom");

                    svg.append("g").attr("class", "x axis")
                        .attr("transform", "translate(0" + "," + (height-40) +")")
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

        HorizBarGraphDirective.scope = {
            data: '='
        };

        return HorizBarGraphDirective;

    };

    angular.module('d3')
        .directive('horizbargraph', ['d3Service', HorizBarGraphDirective]);
}());