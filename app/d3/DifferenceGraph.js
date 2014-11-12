/**
 * Created by rerobins on 11/11/14.
 */

var d3Module = d3Module || angular.module('d3');

d3Module.directive('differencegraph', ['d3Service', function(d3Service) {
    function link(scope, element, attrs) {

        scope.render = function (data) {
            if (!scope.data) {
                return;
            }

            d3Service.get().then(function (d3) {
                var width = 420,
                    barHeight = 20;

                var chart = d3.select(element[0])
                    .append("svg")
                    .style('width', '100%')
                    .style('height', '500');

                var bar = chart.selectAll("g")
                    .data(scope.data)
                    .enter().append("g")
                    .attr("transform", function(d, i) {
                        var height = i * barHeight;
                        var location = width / 2;
                        if (d.data.averageDifference < 0) {
                            location += d.data.averageDifference;
                        }
                        return "translate(" + location + "," + height + ")";
                    });

                bar.append("rect")
                    .attr("width", function(d) { return Math.abs(d.data.averageDifference); })
                    .attr("height", barHeight - 1)
                    .style("fill", function(d) {
                        if (d.data.averageDifference < 0) {
                            return "red";
                        } else {
                            return "green";
                        }
                    });

            });
        };


        scope.$watch('data', function (newVals, oldVals) {
            return scope.render(newVals);
        }, true);

    }

    return {
        link: link,
        scope: {
            data: '=data'
        }
    }

}]);