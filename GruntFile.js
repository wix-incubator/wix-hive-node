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
                src: ['lib/*.js'],
                options: {
                    destination: 'doc'
                }
            }
        },
        clean: {
            all: ['doc']
        }
    });

    grunt.loadNpmTasks('grunt-jsdox');
    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-contrib-clean');

    // Default task(s).
    grunt.registerTask('default', ['clean', 'jsdox', 'jsdoc']);

};