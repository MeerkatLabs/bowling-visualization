/*
 * bowling-webapp
 * https://github.com/MeerkatLabs/bowling-visualization
 *
 * Copyright (c) 2014 Meerkat Labs
 * http://www.meerkatlabsllc.com/
 * Licensed under the MIT License
 */

(function() {
    // Add the route information for the Match Controller.
    angular.module('bowling')
        .config(['$routeProvider', function($routeProvider) {
            $routeProvider.
                when('/matches/:matchId', {
                    templateUrl: 'match/partials/matchDetail.html',
                    controller: 'MatchDetailCtrl'
                });
        }]);
}());