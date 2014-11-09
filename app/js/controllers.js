var phonecatControllers = angular.module('leaguecontrollers', []);

phonecatControllers
    .controller('LeagueController', ['$scope', 'dataProvider',
    function ($scope, dataProvider) {

        dataProvider.getData().then(function (league) {
            $scope.league = league;
        });

    }
]);

