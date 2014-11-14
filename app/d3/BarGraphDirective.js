/*
 * bowling-webapp
 * https://github.com/MeerkatLabs/bowling-visualization
 *
 * Copyright (c) 2014 Meerkat Labs
 * http://www.meerkatlabsllc.com/
 * Licensed under the MIT License
 */

var d3Module = d3Module || angular.module('d3');

d3Module.directive('bargraph', ['d3Service', function(d3Service) {

    var link = function(scope, element, attrs) {

        scope.render = function() {
            if (!scope.data) {
                return;
            }

            d3Service.get().then(function (d3) {
                var svg = d3.select(element[0]);
                var height = parseInt(svg.style('height')),
                    width = parseInt(svg.style('width'));

                var barHeight = height / scope.data.length;

                var xScale = d3.scale.linear()
                    .domain([0, d3.max(scope.data, function(d) {
                        return d.value;
                    })]).range([0, width]);

                var colors = d3.scale.category10();

                var bar = svg.selectAll('g')
                    .data(scope.data)
                    .enter().append("g")
                    .attr("transform", function(d, i) {
                        var height = (i * barHeight);
                        var location = 0;
                        return "translate(" + location + "," + height + ")";
                    });

                bar.append("rect")
                    .attr("width", function(d) {
                        return xScale(d.value);
                    })
                    .attr("height", barHeight - 1)
                    .style("fill", function(d,i) {
                        return colors(i);
                    });

                bar.append("text")
                    .attr("x", function(d) { return xScale(d.value) - 3; })
                    .attr("y", barHeight / 2)
                    .attr("dy", ".35em")
                    .attr("text-anchor", "end")
                    .attr("fill", "white")
                    .text(function(d) { return d.label + " (" + d.value + ")"; });

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
            data: '='
        }
    };

}]);
