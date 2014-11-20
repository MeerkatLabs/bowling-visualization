/*
 * bowling-webapp
 * https://github.com/MeerkatLabs/bowling-visualization
 *
 * Copyright (c) 2014 Meerkat Labs
 * http://www.meerkatlabsllc.com/
 * Licensed under the MIT License
 */

/**
 * Bowling namespace and global definitions.
 */
; (function (undefined) {

    /**
     * Core namespace.
     * @type {{}}
     */
    var bowling = {
        /**
         * This is the current league that is being displayed/manipulated.
         * @type {bowling.League}
         */
        currentLeague: null,

    };

    // Install the bowling namespace into the global scope.
    if (typeof this.bowling !== 'undefined') {
        throw 'An object called bowling is already defined in the global scope';
    } else {
        this.bowling = bowling;
    }

}).call(this);
