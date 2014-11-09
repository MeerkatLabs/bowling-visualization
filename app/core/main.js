/**
 * Created by rerobins on 11/8/14.
 */

var bowlingApp = bowlingApp || angular.module('bowling');

bowlingApp.controller('main', ['$scope',
    function ($scope) {

    }
]);

bowlingApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/main',  {
            templateUrl: 'core/partials/main.html',
            controller: 'main'
        });
    }]);