/**
 * Created by rerobins on 11/8/14.
 */

var bowlingApp = bowlingApp || angular.module('bowling');

bowlingApp.controller('TeamDetailController', ['$scope', '$routeParams', 'dataProvider',
    function ($scope, $routeParams, dataProvider) {

        dataProvider.getData().then(function (league) {
            var foundTeam = bowling.utils.findInArray(league.teams, function (element) {
                return $routeParams.teamId == element.id;
            });

            if (foundTeam == null) {
                console.error("Couldn't find team: " + $routeParams.teamId);
                return;
            }

            $scope.team = foundTeam;
        });

    }]);