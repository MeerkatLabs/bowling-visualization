/**
 * Created by rerobins on 11/12/14.
 */

var d3Module = d3Module || angular.module('d3');

d3Module.directive('piechart', ['d3Service','$window', function(d3Service, $window) {

    function link(scope, element, attrs) {

        scope.render = function (data) {
            if (!scope.data) {
                return;
            }

            d3Service.get().then(function (d3) {

                /**
                 * data is :
                 *
                 * [{label: 'Some label', value: 100},..]
                 */

                console.log(scope.data);

                var svg = d3.select(element[0]);

                var width = parseInt(svg.style('width')),
                    height = parseInt(svg.style('height')),
                    radius = Math.min(width/2, height/2);

                var color = d3.scale.category10();

                var graphic = svg.append('g')
                    .data([scope.data])
                    .attr('transform', 'translate('+ (width/2) + ', ' + (height/2) + ')');

                var pie = d3.layout.pie()
                    .value(function(d) { return d.value; })
                    .sort(null)
                    .endAngle(-3.14 * 2);

                var arc = d3.svg.arc()
                    .outerRadius(radius * 0.8)
                    .innerRadius(0.4 * radius);

                var arcs = graphic.selectAll('g')
                    .data(pie)
                    .enter()
                    .append('g');

                arcs.append('path')
                    .attr('fill', function(d, i) {
                        return color(i);
                    }).attr('d', function(d) {
                       return arc(d);
                    });
                // add the text
                arcs.append("svg:text")
                    .attr("transform", function(d){
                        d.innerRadius = 0;
                        d.outerRadius = radius;
                        return "translate(" + arc.centroid(d) + ")";
                    }).attr("text-anchor", "middle")
                    .text( function(d, i) {
                        return data[i].value;
                    }
                );
            });
        };

        scope.$watch(function() {
            return element[0].offsetWidth;
        }, function() {
            scope.render(scope.data);
        });

        scope.$watch('data', function (newVals, oldVals) {
            console.log("data has been updated", newVals);
            return scope.render(newVals);
        }, true);
    }

    return {
        link: link,
        scope: {
            data: '='
        }
    };

}]);