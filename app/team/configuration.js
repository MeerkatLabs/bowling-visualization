/**
 * Created by rerobins on 11/8/14.
 */

var bowlingApp = bowlingApp || angular.module('bowling');

bowlingApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/team/:teamId', {
            templateUrl: 'team/partials/teamDetail.html',
            controller: 'TeamDetailController'
        });
    }]);