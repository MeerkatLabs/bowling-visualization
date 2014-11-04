var phonecatControllers = angular.module('leaguecontrollers', []);

phonecatControllers.factory("dataProvider", ['$q', function($q) {
        var dataLoaded = false;

        return {
            getData: function() {
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
    }]).controller('LeagueController', ['$scope', 'dataProvider',
    function ($scope, dataProvider) {

        dataProvider.getData().then(function(league) {
            $scope.league = league;
        });

    }
]
);

