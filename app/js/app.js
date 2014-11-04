'use strict';

var bowlingApp = angular.module('bowling', [
    'ngRoute',
    'leaguecontrollers'
]);

bowlingApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/weeks', {
                templateUrl: 'partials/weeklist.html',
                controller: 'LeagueController'
            }).
            when('/matches/:matchId', {
               templateUrl: 'partials/matchdetail.html',
                controller: 'MatchController'
            }).
            otherwise({
                redirectTo: '/weeks'
            });
    }]);