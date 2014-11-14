/*
 * bowling-webapp
 * https://github.com/MeerkatLabs/bowling-visualization
 *
 * Copyright (c) 2014 Meerkat Labs
 * http://www.meerkatlabsllc.com/
 * Licensed under the MIT License
 */

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            d3_and_bowling: {
                files: {
                    "app/dist/d3_components.js": ['app/d3/configuration.js',
                        'app/d3/D3Service.js',
                        'app/d3/DifferenceGraph.js',
                        'app/d3/LegendDirective.js',
                        'app/d3/LineGraphDirective.js'],
                    "app/dist/bowling_components.js": ['app/model/*.js',
                        'app/core/app.js',
                        'app/core/main.js',
                        'app/core/NavBarController.js',
                        'app/match/*.js',
                        'app/player/*.js',
                        'app/team/*.js',
                        'app/weeks/*.js']
                }
            }
        },
        uglify: {
            options: {
                banner: '/* \n' +
                        '   <%= pkg.name %> <%= pkg.version %> \n' +
                        '   (c) 2014 Meerkat Labs <%= pkg.repository %>\n' +
                        '   License: <%= pkg.license %>\n' +
                        '*/\n',
                compress: {
                    drop_console: true
                }
            },
            build_d3: {
                src: 'app/dist/d3_components.js',
                dest: 'app/build/d3_components.min.js'
            },
            build_bowling: {
                src: 'app/dist/bowling_components.js',
                dest: 'app/build/bowling_components.min.js'
            }
        },
        jshint: {
            // define the files to lint
            files: ['Gruntfile.js', 'app/core/*.js', 'app/d3/*.js', 'app/model/*.js',
                    'app/player/*.js', 'app/team/*.js', 'app/weeks/*.js'],
            // configure JSHint (documented at http://www.jshint.com/docs/)
            options: {
                // more options here if you want to override JSHint defaults
                globals: {
                    jQuery: true,
                    console: true,
                    module: true
                }
            }
        },
        sass: {
            dist: {
                options: {
                    style: 'compressed'
                },
                files: {
                    'app/css/bowling.css': 'app/sass/bowling.scss'
                }
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-sass');


    // Default task(s).
    grunt.registerTask('default', ['jshint','concat','uglify', 'sass']);

};
