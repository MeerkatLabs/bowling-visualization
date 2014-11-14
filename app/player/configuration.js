/*
 * bowling-webapp
 * https://github.com/MeerkatLabs/bowling-visualization
 *
 * Copyright (c) 2014 Meerkat Labs
 * http://www.meerkatlabsllc.com/
 * Licensed under the MIT License
 */

var bowlingApp = bowlingApp || angular.module('bowling');

bowlingApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/team/:teamId/players/:playerId', {
                templateUrl: 'player/partials/playerData.html',
                controller: 'PlayerDetailController'
            });
    }]);

bowling.events = bowling.events || {};
bowling.events.player = {

    found: "player::found"

};
