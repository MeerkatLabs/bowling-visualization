'use strict';

var bowlingApp = angular.module('bowling', ['ngRoute']);

bowlingApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.otherwise({
            redirectTo: '/main'
        });
    }]);

bowlingApp.factory("dataProvider", ['$q', function ($q) {
    var dataLoaded = false;

    return {
        getData: function () {
            if (!dataLoaded) {
                var result = bowling.initialize({"root": "testdata"}, $q);
                return result.then(function (league) {
                    dataLoaded = true;
                    return league;
                });
            } else {
                return $q(function (resolve, reject) {
                    resolve(bowling.currentLeague);
                });
            }
        }
    }
}]);