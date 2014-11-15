'use strict';
/*jshint undef:false */
/*jshint camelcase:false */
module.exports = function(grunt) {
    var plugins = ['sortable', 'movable', 'drawtask', 'tooltips', 'bounds', 'progress'];

    var coverage = grunt.option('coverage');

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
        concatCss: {
            core: {
                src: ['src/core/*.css', 'src/core/**/*.css'],
                dest: 'assets/<%= pkg.name %>.css'
            },
            plugins: {
                src: ['src/plugins/*.css', 'src/plugins/**/*.css'],
                dest: 'assets/<%= pkg.name %>-plugins.css'
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
        cssmin: {
            core: {
                src: ['src/core/*.css'],
                dest: 'assets/<%= pkg.name %>.min.css'
            },
            plugins: {
                src: ['src/plugins/*.css', 'src/plugins/**/*.css'],
                dest: 'assets/<%= pkg.name %>-plugins.min.css'
            }
        },
        jshint: {
            src: {
                options: {
                    jshintrc: '.jshintrc',
                    reporter: require('jshint-stylish')
                },
                src: ['Gruntfile.js', 'src/**/*.js']
            },
            test: {
                options: {
                    jshintrc: 'test/spec/.jshintrc'
                },
                src: ['test/spec/**/*.js']
            }
        },
        watch: {
            files: ['src/**/*.js', 'src/**/*.css', 'src/**/*.html'],
            tasks: ['build']
        },
        karma: {
            unit: {
                configFile: coverage ? 'test/karma-coverage.conf.js' : 'test/karma.conf.js',
                singleRun: true
            }
        },
        coveralls: {
            options: {
                force: true,
                coverage_dir: 'coverage-results',
                recursive: true
            }
        }
    };

    for (var i = 0; i < plugins.length; i++) {
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
        config.concatCss[plugin] = {
            src: ['src/plugins/' + plugin + '.css', 'src/plugins/' + plugin + '/**/*.css'],
            dest: 'assets/<%= pkg.name %>-' + plugin + '-plugin.css'
        };
        config.cssmin[plugin] = {
            src: ['src/plugins/' + plugin + '.css', 'src/plugins/' + plugin + '/**/*.css'],
            dest: 'assets/<%= pkg.name %>-' + plugin + '-plugin.min.css'
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
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    grunt.loadNpmTasks('grunt-html2js');

    grunt.loadNpmTasks('grunt-karma');

    // I can't find any other method to call concat 2 times with distinct options.
    // See https://github.com/gruntjs/grunt-contrib-concat/issues/113
    // Start of ugliness
    grunt.renameTask('concat', 'concatCss');
    grunt.loadNpmTasks('grunt-contrib-concat');
    // End of ugliness

    grunt.loadNpmTasks('grunt-karma-coveralls');

    grunt.registerTask('test', ['karma']);

    grunt.registerTask('build', ['html2js', 'jshint', 'concat', 'concatCss', 'uglify', 'cssmin']);

    grunt.registerTask('default', ['build', 'test']);

};
