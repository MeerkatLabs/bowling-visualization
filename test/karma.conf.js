/*
 * bowling-webapp
 * https://github.com/MeerkatLabs/bowling-visualization
 *
 * Copyright (c) 2014 Meerkat Labs
 * http://www.meerkatlabsllc.com/
 * Licensed under the MIT License
 */

/**
 * Karma test configuration.
 */
module.exports = function(config){
    config.set({

        basePath : '../',

        files : [
            'app/bower_components/angular/angular.js',
            'app/bower_components/angular-route/angular-route.js',
            'app/bower_components/angular-resource/angular-resource.js',
            'app/bower_components/angular-animate/angular-animate.js',
            'app/bower_components/angular-mocks/angular-mocks.js',
            'app/bower_components/d3/d3.js',
            'app/bower_components/jquery/jquery.js',
            'app/build/*.js',
            'test/unit/**/*.js'
        ],

        preprocessors : {
            'app/build/*.js' : 'coverage'
        },

        autoWatch : true,

        frameworks: ['jasmine'],

        browsers : ['Chrome'],

        plugins : [
            'karma-coverage',
            'karma-junit-reporter',
            'karma-chrome-launcher',
            'karma-jasmine'
        ],

        junitReporter : {
            outputFile: 'test_out/unit.xml',
            suite: 'A suite'
        },

        reporters: [
            'coverage',
            'junit'
        ],

        singleRun: true

    });
};
