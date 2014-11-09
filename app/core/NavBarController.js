/**
 * Created by rerobins on 11/8/14.
 */

var bowlingApp = bowlingApp || angular.module('bowling');

bowlingApp.controller('NavBarController', ['$scope', 'dataProvider',
    function ($scope, dataProvider) {

        dataProvider.getData().then(function (league) {
            $scope.teams = league.teams;
            $scope.name = league.name;
        });

    }
]);