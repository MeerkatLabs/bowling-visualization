/*
 * bowling-webapp
 * https://github.com/MeerkatLabs/bowling-visualization
 *
 * Copyright (c) 2014 Meerkat Labs
 * http://www.meerkatlabsllc.com/
 * Licensed under the MIT License
 */

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

/**
 * Data Service is responsible for retrieving the data from the data store directory.
 * @param {Object} configuration
 * @param {string} configuration.root the location of the data files.
 * @param {Object} $q
 * @returns {{getData: getData}}
 * @constructor
 */
function DataService(configuration, $q) {
    var promise = null;
    var myConfiguration = configuration;

    return {
        /**
         * Retrieve the data from the server.  Promise returned.
         * @returns {*}
         */
        getData: function () {

            if (promise === null) {
                promise = bowling.initialize(myConfiguration, $q);
            }

            return promise;
        }
    };
}

/**
 * Provider that allows for configuration of the bowling data model.
 */
angular.module('bowling').provider("dataService", function DataProvider() {
    // Default configuration object.
    var configuration = {
        // data root directory.
        root: 'data'
    };

    // Provide the configuration object for the data service.
    this.configure = function(value) {
        configuration = value;
    };

    // This actually creates the data service with the promise API and the configuration object.
    this.$get = ['$q', function ($q) {
        return new DataService(configuration, $q);
    }];

});
