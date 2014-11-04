var phonecatControllers = angular.module('leaguecontrollers', []);

phonecatControllers.factory("dataProvider", ['$q', function($q) {
        console.log("Running dataProvider factory");

        var dataLoaded = false;

        return {
            getData: function() {
                if (!dataLoaded) {
                    var result = bowling.initialize({"root": "testdata"}, $q);
                    return result.then(function (league) {
                        console.log("Data loaded marking flag");
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
    }]).controller('LeagueController', ['$scope', '$route', 'dataProvider',
    function ($scope, $route, dataProvider) {
        console.log("Loaded league data");

        dataProvider.getData().then(function(league) {
            $scope.league = league;
        });

    }
]
);

