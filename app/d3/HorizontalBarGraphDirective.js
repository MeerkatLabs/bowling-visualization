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
angular.module('d3').directive('horizbargraph', ['d3Service', function(d3Service) {

    var link = function(scope, element, attrs) {

        scope.render = function() {
            if (!scope.data) {
                return;
            }

            d3Service.get().then(function (d3) {
                var svg = d3.select(element[0]);
                var height = parseInt(svg.style('height')),
                    width = parseInt(svg.style('width'));

                var barWidth = width / scope.data.length;

                var yScale = d3.scale.linear()
                    .domain([0, d3.max(scope.data, function(d) {
                        return d.value;
                    })]).range([0, height]);

                var colors = d3.scale.category10();

                var bar = svg.selectAll('g')
                    .data(scope.data)
                    .enter().append("g")
                    .attr("transform", function(d, i) {
                        var location = (i * barWidth);
                        return "translate(" + location + "," + (height-yScale(d.value)) + ")";
                    });

                bar.append("rect")
                    .attr("width", barWidth - 1)
                    .attr("height", function(d) {
                        return yScale(d.value);
                    })
                    .style("fill", function(d,i) {
                        return colors(i);
                    });

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
        watch: {
            data: '='
        }
    };
}]);