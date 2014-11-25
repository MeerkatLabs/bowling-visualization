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
     * Provider that is responsible for providing all of the directives and other components with the d3service
     * functionality.
     * @param configuration configuration object for the service.
     * @param $document the document that will be manipulated with the location of the d3 library js file.
     * @param $q promise api
     * @param $rootScope scope to be notified once the script has been loaded.
     * @returns {{get: get, colorScale: colorScale, baseColor: baseColor}}
     * @constructor
     */
    var D3Service = function(configuration, $document, $q, $rootScope) {
        var deferred = $q.defer();
        var d3 = null;

        function onScriptLoad() {
            // Load client in the browser
            $rootScope.$apply(function() {
                d3 = window.d3;
                deferred.resolve(window.d3);
            });
        }

        // Create a script tag with d3 as the source
        // and call our onScriptLoad callback when it
        // has been loaded
        var scriptTag = $document[0].createElement('script');
        scriptTag.type = 'text/javascript';
        scriptTag.async = true;
        scriptTag.src = configuration.src;
        scriptTag.onreadystatechange = function () {
            if (this.readyState == 'complete') onScriptLoad();
        };

        scriptTag.onload = onScriptLoad;

        var s = $document[0].getElementsByTagName('body')[0];
        s.appendChild(scriptTag);

        return {
            /**
             * Returns the promise that will provide the d3 library.
             * @returns {*}
             */
            get: function() { return deferred.promise; },

            /**
             * Returns a common color scale for all of the directives and other services to use.
             * @returns {*}
             */
            colorScale: function() {
                return configuration.colorScale(d3);
            },

            /**
             * Returns a common color for rendering all of the directives or other services to use for their
             * data representations.
             * @returns {*}
             */
            baseColor: function() {
                return configuration.baseColor(d3);
            }
        };
    };

    /**
     * Provider that will configure the d3 service.
     * @constructor
     */
    var D3Provider = function() {
        // Default configuration object.
        var configuration = {
            // data root directory.
            src: 'http://d3js.org/d3.v3.min.js',
            colorScale: function(d3) {
                return d3.scale.category10();
            },
            baseColor: function(d3) {
                return d3.scale.category10().range()[0];
            }
        };

        /**
         * Returns the current configuration object.
         * @returns {{src: string, colorScale: colorScale, baseColor: baseColor}}
         */
        this.getConfiguration = function() {
            return configuration;
        };

        /**
         * Allows for the overriding of the current configuration object.
         * @param value the new configuration to use.
         */
        this.configure = function(value) {
            configuration = value;
        };

        // This actually creates the data service with the promise API and the configuration object.
        this.$get = ['$document', '$q', '$rootScope', function ($document, $q, $rootScope) {
            return new D3Service(configuration, $document, $q, $rootScope);
        }];
    };

    angular.module('d3')
        .provider('d3Service', D3Provider);

}());