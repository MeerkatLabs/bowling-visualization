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
        throw "Cannot find bowling namespace";
    }

    /**
     * The handicap rules for the league.
     * @param {Object} configuration
     * @param {double} configuration.percentage
     * @param {int} configuration.maximum
     * @param {int|null} configuration.rollingLength
     * @constructor
     */
    bowling.HandicapRules = function (configuration) {
        this.percentage = configuration.percentage || 0.9;
        this.maxScore = configuration.maximum || 210;
        this.rollingLength = configuration.rollingLength || null;
    };

    bowling.HandicapRules.prototype.calculateHandicapFromAverage = function (average) {
        return Math.floor((this.maxScore - average) * this.percentage);
    };

    bowling.HandicapRules.prototype.calculateHandicapFromGames = function (games) {

    };

}).call(this);
