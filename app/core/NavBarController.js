/*
 * bowling-webapp
 * https://github.com/MeerkatLabs/bowling-visualization
 *
 * Copyright (c) 2014 Meerkat Labs
 * http://www.meerkatlabsllc.com/
 * Licensed under the MIT License
 */

(function() {
    /**
     * Controller that is responsible for maintaining the navigation bar content.
     * @param DataService bowling league data loading service.
     * @constructor
     */
    var NavBarController = function(DataService) {
        var controller = this;

        controller.teams = [];
        controller.name = 'Loading';

        DataService.getData().then(function(league) {
            controller.teams = league.teams;
            controller.name = league.name;
        });
    };

    // Load the navigation bar controller.
    angular.module('bowling')
        .controller('NavBarController', ['DataService', NavBarController]);
}());