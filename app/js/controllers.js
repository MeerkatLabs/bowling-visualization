var phonecatControllers = angular.module('leaguecontrollers', []);

phonecatControllers.controller('LeagueController', ['$scope',
    function ($scope) {
        $scope.league = bowling.currentLeague;
    }]);

