/**
 * Created by rerobins on 11/8/14.
 */

var bowlingApp = bowlingApp || angular.module('bowling');

bowlingApp.controller('LeagueController', ['$scope', 'dataProvider',
        function ($scope, dataProvider) {

            dataProvider.getData().then(function (league) {
                $scope.league = league;
            });

        }
    ]);