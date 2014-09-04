module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
        schemas : {
            factory : "lib/SchemaFactory.js",
            schemas : [
                {
                    type : "contact/contact-form",
                    name: 'ContactFormSchema',
                    path: 'schemas/sources/contacts/contactFormSchema.json',
                    out : "schemas/contacts/"
                },
                {
                    type : "contacts/create",
                    name : 'ContactCreateSchema',
                    path: 'schemas/sources/contacts/contactUpdateSchema.json',
                    out : "schemas/contacts/"
                },
                {
                    type : "conversion/complete",
                    name : "ConversionCompleteSchema",
                    path: 'schemas/sources/conversion/completeSchema.json',
                    out : "schemas/conversion/"
                },
                {
                    type : "e_commerce/purchase",
                    name : "PurchaseSchema",
                    path: 'schemas/sources/e_commerce/purchaseSchema.json',
                    out : "schemas/e_commerce/"
                },
                {
                    type : "messaging/send",
                    name : "SendSchema",
                    path: 'schemas/sources/messaging/sendSchema.json',
                    out : "schemas/messaging/"
                },
                {
                    type : "music/album-fan",
                    name : "AlbumFanSchema",
                    path: 'schemas/sources/music/album-fanSchema.json',
                    out : "schemas/music/"
                },
                {
                    type : "music/album-share",
                    name : "AlbumShareSchema",
                    path: 'schemas/sources/music/album-shareSchema.json',
                    out : "schemas/music/"
                },
                {
                    type : "music/track-lyrics",
                    name : "AlbumLyricsSchema",
                    path: 'schemas/sources/music/album-fanSchema.json',
                    out : "schemas/music/"
                },
                {
                    type : "music/track-play",
                    name : "TrackPlaySchema",
                    path: 'schemas/sources/music/playSchema.json',
                    out : "schemas/music/"
                },
                {
                    type : "music/track-played",
                    name : "TrackPlayedSchema",
                    path: 'schemas/sources/music/playedSchema.json',
                    out : "schemas/music/"
                },
                {
                    type : "music/track-share",
                    name : "TrackSkippedSchema",
                    path: 'schemas/sources/music/skippedSchema.json',
                    out : "schemas/music/"
                },
                {
                    type : "music/track-skip",
                    name : "TrackShareSchema",
                    path: 'schemas/sources/music/track-shareSchema.json',
                    out : "schemas/music/"
                }

            ]
        },
        "jsbeautifier" : {
            files : ["./lib/schemas/**/*.js", "./lib/SchemaFactory.js"],
            options : {
                braceStyle: "collapse",
                breakChainedMethods: false,
                e4x: false,
                evalCode: false,
                indentChar: " ",
                indentLevel: 0,
                indentSize: 4,
                indentWithTabs: false,
                jslintHappy: false,
                keepArrayIndentation: false,
                keepFunctionIndentation: false,
                maxPreserveNewlines: 10,
                preserveNewlines: true,
                spaceBeforeConditional: true,
                spaceInParen: false,
                unescapeStrings: false,
                wrapLineLength: 0
            }
        },

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
            all: ['doc', 'docs'],
            schemas : ['lib/schemas']
        }
    });

    grunt.loadNpmTasks('grunt-jsdox');
    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-gh-pages');
    grunt.loadNpmTasks('grunt-jsbeautifier');

    // Default task(s).
    grunt.registerTask('default', ['clean', 'jsdoc']);

    grunt.registerTask('publish', ['clean', 'jsdoc', 'gh-pages']);

    grunt.registerTask('schemas', 'Generates schemas', function (target) {
        var schemaParser = require('./schemas/WixSchemaParser.js');
        var generator = require("./schemas/visitors/ToClassVisitor.js");
        var fs = require('fs');
        var pathp = require('mkdirp');
        var HandleBars = require("Handlebars");

        var factories = [];
        var requires = [];
        var pathPrefix = "lib/";
        var schemaList = grunt.config('schemas').schemas;
        for(var i = 0; i < schemaList.length; i++) {
            var sc = schemaList[i];
            var out = schemaParser.parse(JSON.parse(fs.readFileSync(sc.path, { encoding: "utf8"})), sc.name, new generator());
            if (!fs.existsSync(pathPrefix + sc.out)) {
                pathp.sync(pathPrefix + sc.out);
            }
            fs.writeFileSync(pathPrefix + sc.out + sc.name + ".js", out);
            factories.push({type : sc.type, schema : sc.name});
            requires.push({schema : sc.name, path: "./" + sc.out + sc.name + ".js"});
        }
        var template = HandleBars.compile(fs.readFileSync("schemas/visitors/templates/schemaFactory.hbs", { encoding: "utf8"}));
        fs.writeFileSync(grunt.config('schemas').factory, template({requires : requires, typeList : factories}));


    });

    grunt.registerTask('schemas-prod', ['clean:schemas', 'schemas', 'jsbeautifier']);

};