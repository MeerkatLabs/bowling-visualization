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
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
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
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');


    // Default task(s).
    grunt.registerTask('default', ['jshint','concat','uglify']);

};
