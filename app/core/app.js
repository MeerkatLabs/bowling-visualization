var bowlingApp = angular.module('bowling', ['ngRoute', 'd3']);

bowlingApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.otherwise({
            redirectTo: '/main'
        });
    }]);

bowlingApp.factory("dataProvider", ['$q', function ($q) {
    var dataLoaded = false;
    var currentPromise = null;

    return {
        getData: function () {

            if (currentPromise === null) {
                if (!dataLoaded) {
                    var result = bowling.initialize({"root": "testdata"}, $q);
                    currentPromise = result.then(function (league) {
                        dataLoaded = true;
                        currentPromise = null;
                        return league;
                    });
                } else {
                    return $q(function (resolve, reject) {
                        resolve(bowling.currentLeague);
                    });
                }
            }

            return currentPromise;
        }
    };
}]);