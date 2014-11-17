/*
 * bowling-webapp
 * https://github.com/MeerkatLabs/bowling-visualization
 *
 * Copyright (c) 2014 Meerkat Labs
 * http://www.meerkatlabsllc.com/
 * Licensed under the MIT License
 */
angular.module('d3').factory('d3Service', ['$document', '$q', '$rootScope', function($document, $q, $rootScope) {

    var deferred = $q.defer();

    function onScriptLoad() {
        // Load client in the browser
        $rootScope.$apply(function() { deferred.resolve(window.d3); });
    }

    // Create a script tag with d3 as the source
    // and call our onScriptLoad callback when it
    // has been loaded
    var scriptTag = $document[0].createElement('script');
    scriptTag.type = 'text/javascript';
    scriptTag.async = true;
    scriptTag.src = 'http://d3js.org/d3.v3.min.js';
    scriptTag.onreadystatechange = function () {
        if (this.readyState == 'complete') onScriptLoad();
    };

    scriptTag.onload = onScriptLoad;

    var s = $document[0].getElementsByTagName('body')[0];
    s.appendChild(scriptTag);

    return {
        get: function() { return deferred.promise; }
    };

}]);