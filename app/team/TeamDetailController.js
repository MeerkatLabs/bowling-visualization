/**
 * Created by rerobins on 11/8/14.
 */

var bowlingApp = bowlingApp || angular.module('bowling');

bowlingApp.controller('TeamDetailController', ['$scope', '$routeParams', 'dataProvider', 'TeamDetailService',
    function ($scope, $routeParams, dataProvider, teamDetailService) {

        dataProvider.getData().then(function (league) {
            var foundTeam = bowling.utils.findInArray(league.teams, function (element) {
                return $routeParams.teamId == element.id;
            });

            if (foundTeam === null) {
                console.error("Couldn't find team: " + $routeParams.teamId);
                return;
            }

            teamDetailService.getTeamList(foundTeam).then(function (data) {
               $scope.members = data;
            });

            teamDetailService.getMatchList(foundTeam).then(function (data) {
               $scope.matches = data;

               var pointsFor = 0;
               var pointsAgainst = 0;
               data.forEach(function(match) {
                    pointsFor += match.pointsFor;
                   pointsAgainst += match.pointsAgainst;
               });

                $scope.totalPointsFor = pointsFor;
                $scope.totalPointsAgainst = pointsAgainst;
            });

            $scope.team = foundTeam;
        });

    }]);