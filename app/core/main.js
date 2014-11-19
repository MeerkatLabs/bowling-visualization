/*
 * bowling-webapp
 * https://github.com/MeerkatLabs/bowling-visualization
 *
 * Copyright (c) 2014 Meerkat Labs
 * http://www.meerkatlabsllc.com/
 * Licensed under the MIT License
 */

(function(){

    var Main = function($scope) {

    };

    // Configure the application.
    angular.module('bowling')
        .controller('main', Main)
        .config(['$routeProvider',
            function($routeProvider) {
                $routeProvider.when('/main',  {
                    templateUrl: 'core/partials/main.html',
                    controller: 'main'
                });
            }
        ]);

}());