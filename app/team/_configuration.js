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
        $routeProvider.when('/team/:teamId', {
            templateUrl: 'team/partials/teamDetail.html',
            controller: 'TeamDetailController'
        });
    }]);

bowling.events = bowling.events || {};

bowling.events.team = {

    found: "team::found"

};
