/**
 * Created by rerobins on 11/8/14.
 */

var bowlingApp = bowlingApp || angular.module('bowling');

bowlingApp.controller('LeagueController', ['$scope', 'dataProvider',
        function ($scope, dataProvider) {

            var splitSize = 3;

            dataProvider.getData().then(function (league) {
                $scope.league = league;

                var leagueWeeks = league.weeks.concat();
                var split = [];
                while (leagueWeeks.length > 0) {
                    split.push(leagueWeeks.splice(0,splitSize));
                }

                $scope.splits = split;

            });

        }
    ]);