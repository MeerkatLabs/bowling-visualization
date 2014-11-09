/**
 * Created by rerobins on 11/8/14.
 */

var bowlingApp = bowlingApp || angular.module('bowling');

bowlingApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/weeks', {
            templateUrl: 'weeks/partials/weeklist.html',
            controller: 'LeagueController'
        });
    }]);
