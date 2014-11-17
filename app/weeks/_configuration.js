/*
 * bowling-webapp
 * https://github.com/MeerkatLabs/bowling-visualization
 *
 * Copyright (c) 2014 Meerkat Labs
 * http://www.meerkatlabsllc.com/
 * Licensed under the MIT License
 */
angular.module('bowling').config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/weeks', {
            templateUrl: 'weeks/partials/weeklist.html',
            controller: 'LeagueController'
        });
    }]);
