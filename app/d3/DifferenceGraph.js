/*
 * bowling-webapp
 * https://github.com/MeerkatLabs/bowling-visualization
 *
 * Copyright (c) 2014 Meerkat Labs
 * http://www.meerkatlabsllc.com/
 * Licensed under the MIT License
 */
angular.module('d3').directive('differencegraph', ['d3Service', function(d3Service) {
    function link(scope, element, attrs) {

        scope.render = function (data) {
            if (!scope.data) {
                return;
            }

            d3Service.get().then(function (d3) {

                if (!scope.margin) {
                    scope.margin = 10;
                }

                var svg = d3.select(element[0]);

                var width = parseInt(svg.style("width")),
                    height = parseInt(svg.style("height"))-scope.margin,
                    barHeight = height / scope.data.length;

                var xDomain = [0, 0, 0];

                scope.data.forEach(function (element) {
                   var x = Math.abs(element.data.averageDifference);
                   xDomain[2] = Math.max(xDomain[2], x);
                   xDomain[0] = -xDomain[2];
                });

                var xScale = d3.scale.linear()
                    .domain(xDomain)
                    .range([0, (width/2), width]);

                var xAxis = d3.svg.axis()
                    .scale(xScale)
                    .orient("bottom");

                svg.append("path")
                    .attr("d", d3.svg.line()
                        .x(function(d) {
                            return xScale(0);
                        }).y(function(d) {
                            return d;
                        })([0, height]))
                    .attr("stroke", "black")
                    .attr("stroke-width", 1);

                var bar = svg.selectAll("g")
                    .data(scope.data)
                    .enter().append("g")
                    .attr("transform", function(d, i) {
                        var height = (i * barHeight);
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
                    .attr("transform", "translate(0," + height + ")")
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

    }

    return {
        link: link,
        scope: {
            data: '=data',
            margin: '='
        }
    };

}]);