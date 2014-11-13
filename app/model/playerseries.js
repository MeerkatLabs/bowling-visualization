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
     * A player series contains the games that a roller has bowled for the series.
     * @param {bowling.Player} player
     * @param {bowling.Game[]} games
     * @param {bowling.Week} week
     * @constructor
     */
    bowling.PlayerSeries = function (player, games, week) {
        this.player = player;
        this.games = games;
        this.total = 0;
        this.week = week;

        this.games.forEach(function (element) {
            this.total += element.score;
        }, this);

        this.playerAverage = 0;
        this.handicap = 0;
        this.seriesAverage = Math.floor(this.total / this.games.length);

        // Calculate the average from the games that are defined in this series
        if (player.playerAverage === null) {
            this.playerAverage = Math.floor(this.total / this.games.length);
            this.player.playerAverage = this.playerAverage;
        } else {
            this.playerAverage = this.player.playerAverage;
        }

        // Same thing with the handicap.
        if (player.handicap === null) {
            this.handicap = bowling.currentLeague.handicap.calculateHandicapFromAverage(this.playerAverage);
            this.player.handicap = this.handicap;
        } else {
            this.handicap = this.player.handicap;
        }
    };

}).call(this);