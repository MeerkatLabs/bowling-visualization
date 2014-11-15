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
     * Game that will be displayed.
     * @param {Object} configuration
     * @param {int} configuration.gameNumber
     * @param {int} configuration.score
     * @param {Array} configuration.frames
     * @constructor
     */
    bowling.Game = function (configuration) {
        this.score = configuration.score || null;
        if (configuration.score === 0) {
            this.score = 0;
        }
        this.frames = configuration.frames || null;
        this.gameNumber = configuration.gameNumber - 1;
        this.frameScore = [10];
        this.roller = null;
        this.splits = configuration.splits || [];

        // Always override the score value if the frames are defined.
        if (this.frames !== null) {
            this.calculateScore();
        }
    };

    /**)
     * Calculate the score for all of the frames.
     */
    bowling.Game.prototype.calculateScore = function () {
        this.score = 0;
        this.frames.forEach(function (element, index, frames) {
            var firstBall = element[0];
            var secondBall = element[1];

            var frameScore = 0;

            if (index != 9) {
                if (firstBall == 10) {
                    // Strike, add this score plus the next two balls.
                    frameScore += 10;
                    if (frames[index+1].length == 1 || frames[index + 1][1] === null) {
                        frameScore += 10 + frames[index + 2][0];
                    } else {
                        frameScore += frames[index + 1][0] + frames[index + 1][1];
                    }
                } else if (firstBall + secondBall == 10) {
                    // Spare, add this score plus the next ball.
                    frameScore += 10 + frames[index + 1][0];
                } else {
                    // Just add the scores to the current score.
                    frameScore += element[0] + element[1];
                }
            } else {
                // Special rules for the 10th frame (i.e. just add the scores).
                frameScore += element[0] + element[1];
                if (element.length > 2 && element[2] !== null) {
                    frameScore += element[2];
                }
            }

            this.score += frameScore;
            this.frameScore[index] = this.score;
        }, this);
    };

}).call(this);


