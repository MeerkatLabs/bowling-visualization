/**
 * Created by rerobins on 11/8/14.
 */

var bowlingApp = bowlingApp || angular.module('bowling');

bowlingApp.controller('MatchController', ['$scope', '$routeParams', 'dataProvider',
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

        });
    }]);