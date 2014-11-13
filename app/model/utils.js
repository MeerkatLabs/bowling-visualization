/*
 * bowling-webapp
 * https://github.com/MeerkatLabs/bowling-visualization
 *
 * Copyright (c) 2014 Meerkat Labs
 * http://www.meerkatlabsllc.com/
 * Licensed under the MIT License
 */

; (function(undefined) {

    if (typeof bowling === 'undefined') {
        throw 'Cannot find bowling namespace';
    }

    bowling.utils = {
        /**
         * Find an element in an array based on the callback provided.
         * @param {Array} array
         * @param {function} callback
         * @returns {*}
         */
        findInArray: function (array, callback) {

            var result = null;
            var skip = false;
            array.forEach(function (element) {
                if (!skip && callback(element)) {
                    result = element;
                    skip = true;
                }
            });

            return result;

        }
    };

}).call(this);