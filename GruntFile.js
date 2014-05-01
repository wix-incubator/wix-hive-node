module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        jsdox: {
            generate: {
                options: {
                    contentsEnabled: true,
                    contentsTitle: 'Example Documentation',
                    contentsFile: 'readme.md',
                    pathFilter: /^example/
                },

                src: ['lib/*.js'],
                dest: 'docs'
            }
        },
        jsdoc : {
            dist : {
                src: ['lib/*.js', 'README.md'],
                options: {
                    destination: 'docs',
                    private : false,
                    configure: 'jsdoc.conf.json',
                    template: 'node_modules/grunt-jsdoc/node_modules/ink-docstrap/template'
                }
            }
        },
        'gh-pages': {
            options: {
                base: 'docs'
            },
            src: ['**']
        },
        clean: {
            all: ['doc', 'docs']
        }
    });

    grunt.loadNpmTasks('grunt-jsdox');
    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-gh-pages');

    // Default task(s).
    grunt.registerTask('default', ['clean', 'jsdoc']);

    grunt.registerTask('publish', ['clean', 'jsdoc', 'gh-pages']);

};