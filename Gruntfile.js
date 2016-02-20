(function() {
    /*jshint undef:false */
    /*jshint camelcase:false */
    /* jshint node: true */
    'use strict';

    module.exports = function(grunt) {
        var plugins = ['labels', 'table', 'tree', 'groups', 'sortable', 'movable', 'drawtask', 'tooltips', 'bounds',
            'progress', 'resizeSensor', 'overlap', 'dependencies'];

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
                assets: 'assets/**/*'
            },
            clean: {
                site: ['site'],
                dist: ['dist']
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
                },
                demoToSite: {
                    files: [
                        // includes files within path
                        {expand: true, cwd: 'demo/dist/', src: ['**'], dest: 'site/demo'},
                    ]
                },
                ghPagesToSite: {
                    files: [
                        // includes files within path
                        {expand: true, cwd: 'gh-pages/', src: ['**'], dest: 'site/'},
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
                files: [].concat(sources.js.core, sources.js.plugins, sources.css.core, sources.css.plugins, ['src/**/*.html']),
                tasks: ['build']
            },
            autoprefixer: {
                options: {
                    // Task-specific options go here.
                },
                core: {
                    src: sources.css.core
                },
                plugins: {
                    src: sources.css.plugins
                }
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
                    coverageDir: 'coverage-results',
                    recursive: true
                }
            },
            connect: {
                options: {
                    port: 9101,
                    hostname: '0.0.0.0',
                    keepalive: true,
                    livereload: 39729
                },
                plunker: {
                    options: {
                        open: true,
                        middleware: function(connect) {
                            return [
                                connect().use(
                                    '/bower_components', connect.static('./bower_components')
                                ),
                                connect().use(
                                    '/assets', connect.static('./assets')
                                ),
                                connect().use(
                                    '/dist', connect.static('./dist')
                                ),
                                connect.static('plunker')
                            ];
                        }
                    }
                }
            },
            run: {
                buildDemo: {
                    options: {
                        cwd: 'demo'
                    },
                    cmd: 'grunt'
                },
                buildDocs: {
                    exec: 'mkdocs build --clean'
                }
            },
            replace: {
                site: {
                    options: {
                        patterns: [
                            {
                                match: 'version',
                                replacement: '<%= pkg.version %>'
                            }
                        ]
                    },
                    files: [
                        {src: ['site/index.html'], dest: './'}
                    ]
                },
                siteIndexTitle: {
                    options: {
                        patterns: [
                            {
                                match: /<title>.*?<\/title>/,
                                replacement: '<title>Angular Gantt - Gantt chart component for AngularJS</title>\n'+
                                '        <meta property="og:title" content="Angular Gantt" />\n'+
                                '        <meta property="og:description" content="Gantt chart component for AngularJS" />\n'+
                                '        <meta property="og:type" content="website" />\n'+
                                '        <meta property="og:url" content="https://www.angular-gantt.com/" />\n'+
                                '        <meta property="og:image" content="https://www.angular-gantt.com/img/angular-gantt.png" />'
                            }
                        ]
                    },
                    files: [
                        {src: ['site/index.html'], dest: './'}
                    ]
                }
            },
            'gh-pages': {
                options: {
                    base: 'site',
                    message: 'chore(site): Automatic update (grunt-gh-pages)'
                },
                src: ['**']
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
                src: ['src/plugins/' + plugin + '.js', 'src/plugins/' + plugin + '/**/*.js', '.tmp/generated/plugins/' + plugin + '/*.js'],
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
        grunt.loadNpmTasks('grunt-contrib-clean');
        grunt.loadNpmTasks('grunt-contrib-connect');
        grunt.loadNpmTasks('grunt-replace');
        grunt.loadNpmTasks('grunt-html2js');
        grunt.loadNpmTasks('grunt-autoprefixer');
        grunt.loadNpmTasks('grunt-cleanempty');
        grunt.loadNpmTasks('grunt-gh-pages');
        grunt.loadNpmTasks('grunt-run');
        grunt.loadNpmTasks('grunt-release-it');

        grunt.loadNpmTasks('grunt-karma');

        // I can't find any other method to call concat 2 times with distinct options.
        // See https://github.com/gruntjs/grunt-contrib-concat/issues/113
        // Start of ugliness
        grunt.renameTask('concat', 'concatCss');
        grunt.loadNpmTasks('grunt-contrib-concat');
        // End of ugliness

        grunt.loadNpmTasks('grunt-karma-coveralls');

        grunt.registerTask('test', ['karma']);

        grunt.registerTask('build', ['autoprefixer', 'html2js', 'jshint', 'concat', 'concatCss', 'cleanempty']);

        grunt.registerTask('buildDemo', ['run:buildDemo']);

        grunt.registerTask('buildSite', ['clean:site', 'run:buildDocs', 'run:buildDemo', 'copy:demoToSite', 'copy:ghPagesToSite', 'replace:site', 'replace:siteIndexTitle']);

        grunt.registerTask('uploadSite', ['gh-pages']);

        grunt.registerTask('dist', ['clean:dist', 'build', 'buildSite', 'copy:assetsToDist', 'uglify', 'cssmin']);

        grunt.registerTask('plunker', ['connect:plunker']);

        grunt.registerTask('default', ['build', 'test']);

    };
})();

