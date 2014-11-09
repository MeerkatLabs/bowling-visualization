/**
 * Created by rerobins on 11/8/14.
 */

var bowlingApp = bowlingApp || angular.module('bowling');

bowlingApp.controller('PlayerDetailController', ['$scope', '$routeParams', 'dataProvider',
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

            var y = d3.scale.linear().domain([0, 300])
                .range([500, 0]);

            var incomingAverageLine = d3.svg.line()
                .x(function (d) {
                    return d.weekNumber * 30;
                })
                .y(function (d) {
                    return y(d.data.incomingAverage);
                })
                .interpolate("basis");

            var gameLine = d3.svg.line()
                .x(function (d) {
                    return d.weekNumber * 30;
                }).y(function (d) {
                    return y(d.data.games[0])
                })
                .interpolate("cardinal");

            var gameLine1 = d3.svg.line()
                .x(function (d) {
                    return d.weekNumber * 30;
                }).y(function (d) {
                    return y(d.data.games[0])
                })
                .interpolate("linear");

            var gameLine2 = d3.svg.line()
                .x(function (d) {
                    return d.weekNumber * 30;
                }).y(function (d) {
                    return y(d.data.games[0])
                })
                .interpolate("step");

            $scope.data = data;
            $scope.lines = [incomingAverageLine, gameLine];

            console.log(data);

        });
    }]).directive('linegraph', function() {

    function link(scope, element, attrs) {

        scope.render = function (data) {
            if (!scope.data) {
                return;
            }

            var svg = d3.select(element[0])
                .append("svg")
                .style('width', '100%')
                .style('height', '500');

            console.log( svg.style('width'));
            console.log( parseInt(svg.style('width')));

            scope.lines.forEach(function (element) {
                svg.append("path")
                    .attr("d", element(scope.data))
                    .attr("stroke", "blue")
                    .attr("stroke-width", 2)
                    .attr("fill", "none");

                console.log("Robert", element.interpolate());
            });

        };

        scope.$watch('data', function (newVals, oldVals) {
            return scope.render(newVals);
        }, true);

    }

    return {
        link: link,
        scope: {
            data: '=',
            lines: '='
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

//            bar.append("text")
//                .attr("x", function(d) { return x(d) - 3; })
//                .attr("y", barHeight / 2)
//                .attr("dy", ".35em")
//                .text(function(d) { return d.data.averageDifference; });
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

});
