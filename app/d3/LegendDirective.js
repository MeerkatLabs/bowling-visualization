/**
 * Created by rerobins on 11/12/14.
 */

var d3Module = d3Module || angular.module("d3");

d3Module.directive('legend',  ['d3Service', function(d3Service) {

    function link(scope, element, attrs) {

        scope.render = function() {

            if (!scope.lines) {
                return;
            }

            var parent = d3.select(element[0]);

            var colors = d3.scale.category10();

            parent.selectAll('div')
                .data(scope.lines)
                .enter()
                .append('div')
                .append('span')
                .text(function(d) {
                    return d.label;
                }).style("color", function(d,i) {
                    return colors(i);
                }).style("font-weight", "bold");

        };


        scope.$watch('lines', function (newVals, oldVals) {
            return scope.render(newVals);
        }, true);

    }



    return {
        link: link,
        scope: {
            lines: '='
        }
    }

}]);