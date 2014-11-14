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
                    "app/build/d3_components.js": ['app/d3/_*.js', 'app/d3/*.js'],
                    "app/build/bowling_components.js": [
                        'app/model/_*.js', 'app/model/*.js',
                        'app/core/_*.js', 'app/core/*.js',
                        'app/match/_*.js', 'app/match/*.js',
                        'app/player/_*.js', 'app/player/*.js',
                        'app/team/_*.js', 'app/team/_*.js',
                        'app/weeks/_*.js', 'app/weeks/_*.js'
                        ]
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
                src: 'app/build/d3_components.js',
                dest: 'app/dist/d3_components.min.js'
            },
            build_bowling: {
                src: 'app/build/bowling_components.js',
                dest: 'app/dist/bowling_components.min.js'
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
        },
        watch: {
            scripts: {
                files: ['app/**/*.js', '!app/bower_components/**.js', '!app/dist/*.js', '!app/build/*.js'],
                tasks: ['jshint', 'concat']
            },
            sass: {
                files: ['app/**/*.scss'],
                tasks: ['sass']
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
