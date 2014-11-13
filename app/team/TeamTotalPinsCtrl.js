/*
 * bowling-webapp
 * https://github.com/MeerkatLabs/bowling-visualization
 *
 * Copyright (c) 2014 Meerkat Labs
 * http://www.meerkatlabsllc.com/
 * Licensed under the MIT License
 */

var bowlingApp = bowlingApp || angular.module('bowling');

bowlingApp.controller('TeamTotalPinsCtrl', ['$scope', 'TeamDetailService',
    function($scope, teamDetailService) {

        $scope.$on(bowling.events.team.found, function(event, data) {

            teamDetailService.getPinData(data).then(function (data) {

                $scope.data = data;

            });

        });

    }
]);
