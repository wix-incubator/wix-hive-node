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
                    destination: 'doc',
                    private : false,
                    configure: 'jsdoc.conf.json',
                    template: 'node_modules/grunt-jsdoc/node_modules/ink-docstrap/template'
                }
            }
        },
        clean: {
            all: ['doc', 'docs']
        }
    });

    grunt.loadNpmTasks('grunt-jsdox');
    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-contrib-clean');

    // Default task(s).
    grunt.registerTask('default', ['clean', 'jsdoc']);

};