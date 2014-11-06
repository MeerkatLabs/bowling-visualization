var phonecatControllers = angular.module('leaguecontrollers', []);

phonecatControllers.factory("dataProvider", ['$q', function($q) {
        var dataLoaded = false;

        return {
            getData: function() {
                if (!dataLoaded) {
                    var result = bowling.initialize({"root": "testdata"}, $q);
                    return result.then(function (league) {
                        dataLoaded = true;
                        return league;
                    });
                } else {
                    return $q(function (resolve, reject) {
                       resolve(bowling.currentLeague);
                    });
                }
            }
        }
    }]).controller('LeagueController', ['$scope', 'dataProvider',
    function ($scope, dataProvider) {

        dataProvider.getData().then(function(league) {
            $scope.league = league;
        });

       }
    ]).controller('MatchController', ['$scope', '$routeParams', 'dataProvider',
        function ($scope, $routeParams, dataProvider) {
            dataProvider.getData().then(function(league) {
                $scope.league = league;
                $scope.matchId = $routeParams.matchId;

                var foundMatch = null;
                league.weeks.forEach(function(week) {
                    if (foundMatch == null) {
                        week.matches.forEach(function (match) {
                            if (foundMatch == null && match.id == $routeParams.matchId) {
                                foundMatch = match;
                            }
                        });
                    }
                });
                console.log(foundMatch);
                $scope.match = foundMatch;

                var circleData = [
                    { "cx": 20, "cy": 20, "radius": 20, "color" : "green" },
                    { "cx": 70, "cy": 70, "radius": 20, "color" : "purple" }];

                $scope.circles = circleData;
            });
    }]).directive('bargraph', function() {
        function link(scope, element, attrs) {

            scope.render = function() {
                if (!scope.circles) { return; }

                var svg = d3.select(element[0])
                    .append("svg")
                    .style('width', '100%');

                //Add circles to the svgContainer
                var circles = svg.selectAll("circle")
                                           .data(scope.circles)
                                           .enter()
                                           .append("circle");

                //Add the circle attributes
                var circleAttributes = circles
                                       .attr("cx", function (d) { return d.cx; })
                                       .attr("cy", function (d) { return d.cy; })
                                       .attr("r", function (d) { return d.radius; })
                                       .style("fill", function (d) { return d.color; });
            };

            scope.$watch('circles', function(newVals, oldVals) {
                return scope.render();
            }, true);
        }

        return {
            link: link,
            scope: {
                circles: '=data'
            }
        }
    });

