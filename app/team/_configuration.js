/*
 * bowling-webapp
 * https://github.com/MeerkatLabs/bowling-visualization
 *
 * Copyright (c) 2014 Meerkat Labs
 * http://www.meerkatlabsllc.com/
 * Licensed under the MIT License
 */

(function() {

    angular.module('bowling')
        .constant('teamEvents', {
            found: 'team::found'
        }).config(['$routeProvider',
            function($routeProvider) {
                $routeProvider.when('/team/:teamId', {
                    templateUrl: 'team/partials/teamDetail.html',
                    controller: 'TeamDetailCtrl',
                    controllerAs: 'teamdetail'
                });
            }
        ]);

}());
