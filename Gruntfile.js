module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: ['assets/<%= pkg.name %>.tmpl.html.js','src/**/*.js'],
                dest: 'assets/<%= pkg.name %>.js'
            }
        },
        html2js: {
            app: {
                options: {
                    quoteChar: "'",
                    base:"."
                },
                src: [
                    'template/*.tmpl.html'
                ],
                dest: 'assets/<%= pkg.name %>.tmpl.html.js',
                module: 'templates.gantt'
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
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
                // options here to override JSHint defaults
                trailing: true,
                globals: {
                    browser: true,
                    console: true
                }
            }
        },
        watch: {
            files: ['<%= jshint.files %>'],
            tasks: ['jshint', 'concat']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-html2js');

    grunt.registerTask('default', ['html2js', 'jshint', 'concat', 'uglify']);

};