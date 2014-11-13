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

    /**
     * Player object for each of the teams.
     * @param {Object} configuration
     * @param {string} configuration.id
     * @param {string} configuration.name
     * @param {string} configuration.memberType
     * @param {int} configuration.handicap
     * @constructor
     */
    bowling.Player = function (configuration) {
        this.id = configuration.id || "" + bowling.Player._playerCounter++;
        configuration.id = this.id;
        this.name = configuration.name || "Unnamed Player";
        this.handicap = configuration.handicap || null;
        this.type = configuration.memberType || "regular";
        this.bowledGames = [];
        this.serieses = [];
        this.playerAverage = null;
    };

    /**
     * Field that is used to generate unique identifiers for the players that don't have an identifier defined.
     * @type {number}
     * @private
     */
    bowling.Player._playerCounter = 0;

    bowling.Player.prototype.updateStats = function () {
        var total = 0;
        this.bowledGames.forEach(function (element) {
            total += element.score;
        });

        this.playerAverage = Math.floor(total / this.bowledGames.length);
        this.handicap = bowling.currentLeague.handicap.calculateHandicapFromAverage(this.playerAverage);
    };

}).call(this);