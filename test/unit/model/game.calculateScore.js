/*
 * bowling-webapp
 * https://github.com/MeerkatLabs/bowling-visualization
 *
 * Copyright (c) 2014 Meerkat Labs
 * http://www.meerkatlabsllc.com/
 * Licensed under the MIT License
 */
'use strict';

describe("game.calculateScore", function() {
    it( "full strikes should score 300", function() {

        var frames = [10];

        for (var i = 0; i < 9; ++i) {
            frames[i] = [10, null];
        }

        frames[9] = [10, 10, 10];

        var object = {
            frames: frames
        };

        var game = new bowling.Game(object);
        game.calculateScore();

        expect(game.score).toEqual(300);

    });

    it("should score nine spares as 191", function() {

        var frames = [10];

        for (var i = 0; i < 9; ++i) {
            frames[i] = [9, 1];
        }

        frames[9] = [9, 1, 10];

        var object = {
            frames: frames
        };

        var game = new bowling.Game(object);
        game.calculateScore();

        expect(game.score).toEqual(191);
    });

    it( "should score correctly", function() {

        var frames = [10];

        for (var i = 0; i < 9; ++i) {
            frames[i] = [10-i, (i == 0 ? null : i)];
        }

        frames[9] = [1, 9, 0];

        var object = {
            frames: frames
        };

        var game = new bowling.Game(object);
        game.calculateScore();

        expect(game.score).toEqual(146);
    });

    it( "should score correctly", function() {

        var frames = [10];

        for (var i = 0; i < 9; ++i) {
            frames[i] = [i, 10-i];
        }

        frames[9] = [0, 0, null];
        frames[0] = [0, 0];

        var object = {
            frames: frames
        };

        var game = new bowling.Game(object);
        game.calculateScore();

        expect(game.score).toEqual(115);

    });
});



