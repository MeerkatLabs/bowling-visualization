/*
 * bowling-webapp
 * https://github.com/MeerkatLabs/bowling-visualization
 *
 * Copyright (c) 2014 Meerkat Labs
 * http://www.meerkatlabsllc.com/
 * Licensed under the MIT License
 */

(function() {

    // Core application for the bowling functionality.
    angular.module('bowling', ['ngRoute', 'd3']);

    // Configure the default view for the application.
    angular.module('bowling')
        .config(['$routeProvider',
            function($routeProvider) {
                $routeProvider.otherwise({
                    redirectTo: '/main'
                });
            }
        ]);

}());