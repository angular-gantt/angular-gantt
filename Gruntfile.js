'use strict';
/*jshint globalstrict: true */
/*jshint undef:false */
/*jshint camelcase:false */
module.exports = function(grunt) {
    var plugins = ['sortable', 'movable', 'drawtask', 'tooltips', 'bounds', 'progress'];

    var coverage = grunt.option('coverage');

    var sources = {
        js: {
            core:['src/core/*.js', 'src/core/**/*.js', '.tmp/generated/core/**/*.js'],
            plugins: ['src/plugins/*.js', 'src/plugins/**/*.js', '.tmp/generated/plugins/**/*.js']
        },
        css: {
            core: ['src/core/*.css', 'src/core/**/*.css'],
            plugins: ['src/plugins/*.css', 'src/plugins/**/*.css']
        }
    };

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
                banner: '/*\n' +
                'Project: <%= pkg.name %> v<%= pkg.version %> - <%= pkg.description %>\n' +
                'Authors: <%= pkg.author %>, <%= pkg.contributors %>\n' +
                'License: <%= pkg.license %>\n' +
                'Homepage: <%= pkg.homepage %>\n' +
                'Github: <%= pkg.repository.url %>\n' +
                '*/\n'
            },
            core: {
                src: sources.js.core,
                dest: 'assets/<%= pkg.name %>.js'
            },
            plugins: {
                src: sources.js.plugins,
                dest: 'assets/<%= pkg.name %>-plugins.js'
            }
        },
        concatCss: {
            core: {
                src: sources.css.core,
                dest: 'assets/<%= pkg.name %>.css'
            },
            plugins: {
                src: sources.css.plugins,
                dest: 'assets/<%= pkg.name %>-plugins.css'
            }
        },
        cleanempty: {
            options: {},
            src: 'assets/**/*'
        },
        uglify: {
            options: {
                banner: '/*\n' +
                'Project: <%= pkg.name %> v<%= pkg.version %> - <%= pkg.description %>\n' +
                'Authors: <%= pkg.author %>, <%= pkg.contributors %>\n' +
                'License: <%= pkg.license %>\n' +
                'Homepage: <%= pkg.homepage %>\n' +
                'Github: <%= pkg.repository.url %>\n' +
                '*/\n',
                sourceMap: true
            },
            core: {
                files: {
                    'dist/<%= pkg.name %>.min.js': sources.js.core
                }
            },
            plugins: {
                files: {
                    'dist/<%= pkg.name %>-plugins.min.js': sources.js.plugins
                }
            }
        },
        cssmin: {
            core: {
                src: sources.css.core,
                dest: 'dist/<%= pkg.name %>.min.css'
            },
            plugins: {
                src: sources.css.plugins,
                dest: 'dist/<%= pkg.name %>-plugins.min.css'
            }
        },
        copy: {
            assetsToDist: {
                files: [
                    // includes files within path
                    {expand: true, cwd: 'assets/', src: ['**'], dest: 'dist/'},
                ]
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
            files: [].concat(sources.js.core, sources.js.plugins, ['src/**/*.html']),
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
            dest: 'dist/<%= pkg.name %>-' + plugin + '-plugin.min.css'
        };
        var uglifyFiles = {};
        uglifyFiles['dist/<%= pkg.name %>-' + plugin + '-plugin.min.js'] = config.concat[plugin].src;
        config.uglify[plugin] = {files: uglifyFiles};
    }

    grunt.initConfig(config);

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-cleanempty');


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

    grunt.registerTask('build', ['html2js', 'jshint', 'concat', 'concatCss', 'cleanempty']);

    grunt.registerTask('dist', ['build', 'copy:assetsToDist', 'uglify', 'cssmin']);

    grunt.registerTask('default', ['build', 'test']);

};
