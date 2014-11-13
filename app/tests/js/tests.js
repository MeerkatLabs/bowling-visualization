/*
 * bowling-webapp
 * https://github.com/MeerkatLabs/bowling-visualization
 *
 * Copyright (c) 2014 Meerkat Labs
 * http://www.meerkatlabsllc.com/
 * Licensed under the MIT License
 */

QUnit.test( "fullstrikes", function(assert) {

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

    assert.equal(game.score, 300, "Score should be 300");

});

QUnit.test( "ninespares", function(assert) {

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

    assert.equal(game.score, 191, "Score should be 191");

});

QUnit.test( "reverseSpares", function(assert) {

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

    assert.equal(game.score, 146, "Score should be 146");

});

QUnit.test( "empty10th", function(assert) {

    var frames = [10];

    for (var i = 0; i < 9; ++i) {
        frames[i] = [i, 10-i];
    }

    frames[9] = [0, 0, null];
    frames[0] = [0, 0];

    var object = {
        frames: frames
    };

    console.log(frames);

    var game = new bowling.Game(object);
    game.calculateScore();

    assert.equal(game.score, 115, "Score should be 115");

});