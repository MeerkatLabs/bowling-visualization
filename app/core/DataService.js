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
     * Data Service is responsible for retrieving the data from the data store directory.
     * @param {Object} configuration
     * @param {string} configuration.root the location of the data files.
     * @param {Object} $q
     * @constructor
     */
    function DataService(configuration, $q) {
        var promise = null;
        var myConfiguration = configuration;

        promise = bowling.initialize(myConfiguration, $q);

        /**
         * Load the league data and results.
         * @returns {*} promise
         */
        this.getData = function() {
            return promise;
        };

        /**
         * Return the configuration object.
         * @returns {{root: string}}
         */
        this.getConfiguration = function() {
            return myConfiguration;
        };

    }

    /**
     * Data Provider definition.
     * @constructor
     */
    function DataProvider() {
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
    }

    /**
     * Provider that allows for configuration of the bowling data model.
     */
    angular.module('bowling').provider('DataService', DataProvider);
}());