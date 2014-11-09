/**
 * Created by rerobins on 11/8/14.
 */
var bowlingApp = bowlingApp || angular.module('bowling');

// Add the route information for the Match Controller.
bowlingApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/matches/:matchId', {
                templateUrl: 'match/partials/matchDetail.html',
                controller: 'MatchController'
            });
    }]);