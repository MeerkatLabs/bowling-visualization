/*
 * bowling-webapp
 * https://github.com/MeerkatLabs/bowling-visualization
 *
 * Copyright (c) 2014 Meerkat Labs
 * http://www.meerkatlabsllc.com/
 * Licensed under the MIT License
 */

/**
 * Controller responsible for showing the list of weeks that are in a league.
 */
(function() {

    /**
     * Main controller for the weeks page.
     * @param $scope
     * @param WeekService
     * @constructor
     */
    var WeekCtrl = function($scope, WeekService) {

        var controller = this;

        WeekService.getWeeks().then(function (data) {

            controller.league = data.league;
            controller.splits = data.splits;

        });
    };

    angular.module('bowling')
        .controller('WeekCtrl', ['$scope', 'WeekService', WeekCtrl]);

}());