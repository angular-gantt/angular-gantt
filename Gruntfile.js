'use strict';
/*jshint undef:false */
module.exports = function(grunt) {
    var plugins = ['sortable', 'movable', 'tooltips'];

    var config = {
        pkg: grunt.file.readJSON('package.json'),
        html2js: {
            options: {
                quoteChar: '\'',
                indentString: '    ',
                module: 'gantt.templates',
                singleModule: true
            },
            core: {
                src: ['src/template/**/*.html'],
                dest: '.tmp/generated/core/html2js.js'
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
                src: ['src/core/*.js', 'src/core/**/*.js', '.tmp/generated/core/**/*.js'],
                dest: 'assets/<%= pkg.name %>.js'
            },
            plugins: {
                src: ['.tmp/generated/plugins/**/*.js', 'src/plugins/*.js', 'src/plugins/**/*.js'],
                dest: 'assets/<%= pkg.name %>-plugins.js'
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
    };

    for (var i=0; i<plugins.length; i++) {
        var plugin = plugins[i];
        config.html2js[plugin] = {
            module: 'gantt.' + plugin + '.templates',
            src: ['src/plugins/' + plugin + '/**/*.html'],
            dest: '.tmp/generated/plugins/' + plugin + '/html2js.js'
        };
        config.concat[plugin] = {
            src: ['src/plugins/' + plugin + '.js', 'src/plugins/' + plugin + '/**/*.js'],
                dest: 'assets/<%= pkg.name %>-' + plugin + '-plugin.js'
        };
        var uglifyFiles = {};
        uglifyFiles['assets/<%= pkg.name %>-' + plugin + '.min.js'] = ['<%= concat.' + plugin + '.dest %>'];
        config.uglify[plugin] = {files: uglifyFiles};
    }

    grunt.initConfig(config);

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
