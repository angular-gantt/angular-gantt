'use strict';
/*jshint undef:false */
module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        html2js: {
            options: {
                quoteChar: '\'',
                indentString: '    ',
                module: 'ganttTemplates',
                singleModule: true
            },
            main: {
                src: ['src/template/**/*.html'],
                dest: '.tmp/generated/html2js.js'
            }
        },
        concat: {
            options: {
                separator: '\n',
                sourceMap: true,
                // Replace all 'use strict' statements in the code with a single one at the top
                banner: '/*\n' +
                'Project: angular-gantt for AngularJS\n' +
                'Author: Marco Schweighauser\n' +
                'Contributors: Rémi Alvergnat\n' +
                'License: MIT.\n' +
                'Github: https://github.com/angular-gantt/angular-gantt\n' +
                '*/\n' +
                '\'use strict\';\n',
                process: function(src) {
                    return src.replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1\n')
                        .replace(/(^|\n)[ \t]*(\/\*\s*global\s+.*?:\s+.*?\*\/);?\s*/g, '$1\n');
                }
            },
            core: {
                src: ['src/core/**/*.js', '.tmp/generated/**/*.js'],
                dest: 'assets/<%= pkg.name %>.js'
            },
            plugins: {
                src: ['src/plugins/**/*.js'],
                dest: 'assets/<%= pkg.name %>-plugins.js'
            },
            sortable: {
                src: ['src/plugins/sortable/*.js'],
                dest: 'assets/<%= pkg.name %>-sortable-plugin.js'
            },
            movable: {
                src: ['src/plugins/movable/*.js'],
                dest: 'assets/<%= pkg.name %>-movable-plugin.js'
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\nuse strict;\n',
                sourceMap: true
            },
            core: {
                files: {
                    'assets/<%= pkg.name %>.min.js': ['<%= concat.core.dest %>']
                }
            },
            plugins: {
                files: {
                    'assets/<%= pkg.name %>-plugins.min.js': ['<%= concat.plugins.dest %>']
                }
            },
            sortable: {
                files: {
                    'assets/<%= pkg.name %>-sortable.min.js': ['<%= concat.sortable.dest %>']
                }
            },
            movable: {
                files: {
                    'assets/<%= pkg.name %>-movable.min.js': ['<%= concat.movable.dest %>']
                }
            }

        },
        jshint: {
            files: ['Gruntfile.js', 'src/**/*.js'],
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            }
        },
        watch: {
            files: ['<%= jshint.files %>', 'src/**/*.html'],
            tasks: ['build']
        },
        karma: {
            unit: {
                configFile: 'test/karma.conf.js',
                singleRun: true
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.loadNpmTasks('grunt-html2js');

    grunt.loadNpmTasks('grunt-karma');

    grunt.registerTask('test', ['karma']);

    grunt.registerTask('build', ['html2js', 'jshint', 'concat', 'uglify']);

    grunt.registerTask('default', ['build', 'test']);

};
