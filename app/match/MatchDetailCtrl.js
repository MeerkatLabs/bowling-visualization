/*
 * bowling-webapp
 * https://github.com/MeerkatLabs/bowling-visualization
 *
 * Copyright (c) 2014 Meerkat Labs
 * http://www.meerkatlabsllc.com/
 * Licensed under the MIT License
 */
(function() {

    var MatchDetailCtrl = function($scope, $routeParams, $timeout, MatchFindService, MatchScoresService, matchEvents) {

        var controller = this;
        controller.hasScores = false;

        console.log('finding match');

        MatchFindService.findMatch($routeParams.matchId).then(function (data) {

            controller.league = data.league;
            controller.match = data.match;

            $timeout(function() {
                console.log("Broadcasting: " + matchEvents.found, data);
                $scope.$broadcast(matchEvents.found, data);
            });

            MatchScoresService.hasScores(data.match).then(function (data) {
                controller.hasScores = data.hasScores;
            });

        });

    };

    angular.module('bowling')
        .controller('MatchDetailCtrl',
                    ['$scope', '$routeParams', '$timeout', 'MatchFindService',
                        'MatchScoresService', 'matchEvents', MatchDetailCtrl]);
}());