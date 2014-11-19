/*
 * bowling-webapp
 * https://github.com/MeerkatLabs/bowling-visualization
 *
 * Copyright (c) 2014 Meerkat Labs
 * http://www.meerkatlabsllc.com/
 * Licensed under the MIT License
 */

/**
 * Configuration for the player components.
 */
(function() {
    angular.module('bowling')
        .constant('playerEvents', {
            found: "player::found"
        }).config(['$routeProvider',
            function ($routeProvider) {
                $routeProvider.when('/team/:teamId/players/:playerId', {
                    templateUrl: 'player/partials/playerData.html',
                    controller: 'PlayerDetailCtrl',
                    controllerAs: 'playerMain'
                });
            }
        ]);

}());
