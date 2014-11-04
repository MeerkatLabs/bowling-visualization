var phonecatControllers = angular.module('leaguecontrollers', []);

phonecatControllers.factory("dataProvider", ['$q', function($q) {
        console.log("Running dataProvider factory");

        return {
            getData: function() {
                var result = bowling.initialize({"root": "testdata"}, $q);
                return result;
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

