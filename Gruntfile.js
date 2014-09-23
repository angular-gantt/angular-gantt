'use strict';
/*jshint undef:false */
module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
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
                process: function(src, filepath) {
                    return '// ' + filepath + '\n' +
                        src.replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1')
                            .replace(/(^|\n)[ \t]*(\/\*\s*global\s+.*?:\s+.*?\*\/);?\s*/g, '$1');
                }
            },
            dist: {
                src: ['src/**/*.js'],
                dest: 'assets/<%= pkg.name %>.js'
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\nuse strict;\n',
                sourceMap: true
            },
            dist: {
                files: {
                    'assets/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
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
            files: ['<%= jshint.files %>'],
            tasks: ['default']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.registerTask('default', ['jshint', 'concat', 'uglify']);

};