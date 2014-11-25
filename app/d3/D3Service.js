/*
 * bowling-webapp
 * https://github.com/MeerkatLabs/bowling-visualization
 *
 * Copyright (c) 2014 Meerkat Labs
 * http://www.meerkatlabsllc.com/
 * Licensed under the MIT License
 */
(function() {

    var D3Service = function(configuration, $document, $q, $rootScope) {
        var deferred = $q.defer();
        var colorScale = null;
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
            get: function() { return deferred.promise; },
            colorScale: function() {
                return configuration.colorScale(d3);
            }
        };
    };

    var D3Provider = function() {
        // Default configuration object.
        var configuration = {
            // data root directory.
            src: 'http://d3js.org/d3.v3.min.js',
            colorScale: function(d3) {
                return d3.scale.category10();
            }
        };

        this.getConfiguration = function() {
            return configuration;
        };

        // Provide the configuration object for the data service.
        this.configure = function(value) {
            configuration = value;
        };

        // This actually creates the data service with the promise API and the configuration object.
        this.$get = ['$document', '$q', '$rootScope', function ($document, $q, $rootScope) {
            return new D3Service(configuration, $document, $q, $rootScope);
        }];
    };

    angular.module('d3').provider('d3Service', D3Provider);

}());