var phonecatControllers = angular.module('leaguecontrollers', []);

phonecatControllers.factory("dataProvider", ['$q', function ($q) {
    var dataLoaded = false;

    return {
        getData: function () {
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

        dataProvider.getData().then(function (league) {
            $scope.league = league;
        });

    }
]).controller('MatchController', ['$scope', '$routeParams', 'dataProvider',
    function ($scope, $routeParams, dataProvider) {
        dataProvider.getData().then(function (league) {
            $scope.league = league;
            $scope.matchId = $routeParams.matchId;

            var foundMatch = null;
            league.weeks.forEach(function (week) {
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
                { "cx": 20, "cy": 20, "radius": 20, "color": "green" },
                { "cx": 70, "cy": 70, "radius": 20, "color": "purple" }
            ];

            $scope.circles = circleData;
        });
    }]).controller('PlayerDetailController', ['$scope', '$routeParams', 'dataProvider',
    function ($scope, $routeParams, dataProvider) {

        dataProvider.getData().then(function (league) {
            var foundTeam = bowling.utils.findInArray(league.teams, function (element) {
                return $routeParams.teamId == element.id;
            });

            if (foundTeam == null) {
                console.error("Couldn't find team: " + $routeParams.teamId);
                return;
            }

            var foundPlayer = bowling.utils.findInArray(foundTeam.players, function (element) {
                return $routeParams.playerId == element.id;
            });

            if (foundPlayer == null) {
                console.error("Couldn't find team: " + $routeParams.playerId);
                return;
            }

            $scope.roller = foundPlayer;
            $scope.league = league;

            var data = [];

            foundPlayer.serieses.forEach(function (element) {

                var week = {
                    weekNumber: element.week.weekNumber,
                    date: element.week.date,
                    data: {
                        games: []
                    }
                };

                for (var weekIndex = 0; weekIndex < bowling.currentLeague.gamesPerSeries; ++weekIndex) {
                    week.data.games[weekIndex] = element.games[weekIndex].score;
                }

                week.data.average = element.seriesAverage;
                week.data.incomingAverage = element.playerAverage;
                week.data.averageDifference = element.seriesAverage - element.playerAverage;

                data.push(week);

            });

            $scope.data = data;

            console.log(data);

        });
    }]).directive('linegraph', function() {

    function link(scope, element, attrs) {

        scope.render = function (data) {
            if (!scope.data) {
                return;
            }

            var barHeight = 20;

            var svg = d3.select(element[0])
                .append("svg")
                .style('width', '100%')
                .style('height', '500');

            var y = d3.scale.linear().domain([0, 300])
                .range([500, 0]);

            var incomingAverageLine = d3.svg.line()
                .x(function (d) {
                    return d.weekNumber * 30;
                })
                .y(function (d) {
                    return y(d.data.incomingAverage);
                })
                .interpolate("linear");

            var gameLine = d3.svg.line()
                .x(function (d) {
                    return d.weekNumber * 30;
                }).y(function (d) {
                    return y(d.data.games[0])
                })
                .interpolate("linear");

            var bar = svg.append("path")
                .attr("d", incomingAverageLine(scope.data))
                .attr("stroke", "blue")
                .attr("stroke-width", 2)
                .attr("fill", "none");

            var bar = svg.append("path")
                .attr("d", gameLine(scope.data))
                .attr("stroke", "red")
                .attr("stroke-width", 2)
                .attr("fill", "none");
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
}).directive('differencegraph', function() {
    function link(scope, element, attrs) {

        scope.render = function (data) {
            if (!scope.data) {
                return;
            }

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
                .attr("height", barHeight - 1);

            bar.append("text")
                .attr("x", function(d) { return x(d) - 3; })
                .attr("y", barHeight / 2)
                .attr("dy", ".35em")
                .text(function(d) { return d.data.averageDifference; });
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

}).directive('bargraph', function () {
    function link(scope, element, attrs) {

        scope.render = function () {
            if (!scope.circles) {
                return;
            }

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
                .attr("cx", function (d) {
                    return d.cx;
                })
                .attr("cy", function (d) {
                    return d.cy;
                })
                .attr("r", function (d) {
                    return d.radius;
                })
                .style("fill", function (d) {
                    return d.color;
                });
        };

        // Tell the scope to render the values when the circles have been updated.
        scope.$watch('circles', function (newVals, oldVals) {
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

