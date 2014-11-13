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
     * Team object that contains players for the league.
     * @param {Object} configuration
     * @param {string} configuration.id
     * @param {string} configuration.name
     * @param {boolean} configuration.visualize
     * @param {Array} configuration.rollers
     * @constructor
     */
    bowling.Team = function (configuration) {
        this.id = configuration.id;
        this.name = configuration.name || "Unnamed Team";
        this.visualize = configuration.visualize || false;
        this.players = [];
        this.series = [];

        var localPlayers = configuration.rollers || [];

        localPlayers.forEach(function (element) {
            var player = new bowling.Player(element);

            if (player.type == "substitute") {
                bowling.currentLeague.subs.push(player);
            } else {
                this.addPlayer(player);
            }
        }, this);
    };

    /**
     * Add a player to the team.
     * @param {bowling.Player} player
     */
    bowling.Team.prototype.addPlayer = function (player) {
        this.players.push(player);
    };

}).call(this);