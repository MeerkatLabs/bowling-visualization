/**
 * Created by rerobins on 11/8/14.
 */

var bowlingApp = bowlingApp || angular.module('bowling');

bowlingApp.controller('NavBarController', ['$scope', 'dataService',
    function ($scope, dataService) {

        dataService.getData().then(function (league) {
            $scope.teams = league.teams;
            $scope.name = league.name;
        });

    }
]);