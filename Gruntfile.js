'use strict';
var fs = require('fs');
var _ = require('lodash');

var testFiles = _.filter(fs.readdirSync('./test'),function  (fileName) {
  return /test-[0-9\.]+-/.test(fileName);
});
module.exports = function(grunt) {
    // Show elapsed time at the end
    require('time-grunt')(grunt);
    // Load all grunt tasks
    require('load-grunt-tasks')(grunt);

    // Project configuration.
    grunt.initConfig({
        concurrent: {
            debug: {
                tasks: [
                    'simplemocha',
                    'node-inspector'
                ],
                options: {
                    logConcurrentOutput: true
                }
            }
        },
        nodemon: {
            debug: {
                script: './node_modules/mocha/bin/_mocha',
                options: {
                    nodeArgs: ['--debug-brk'],
                    env: {
                        PORT: process.env.PORT || 9000
                    },
                    callback: function(nodemon) {
                        nodemon.on('log', function(event) {
                            console.log(event.colour);
                        });

                        // opens browser on initial server start
                        nodemon.on('config:update', function() {
                            setTimeout(function() {
                                require('open')('http://localhost:8080/debug?port=5858');
                            }, 500);
                        });
                    }
                }
            }
        },
        simplemocha: (function(ops) {
            //getting test files for creating grunt tasks 
            testFiles.forEach(function(item) {
                var name = item.replace(/(test-[0-9\.]+-|\.js)/g,'');
                ops[name] = {src:['test/'+item]};
            });
            return ops;    
        })({
            options: {
                globals: ['expect'],
                timeout: 3000,
                ignoreLeaks: false,
                ui: 'bdd',
                reporter: 'spec'
            },
            all: {
                src: ['test/test*.js']
            }
        }),
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            gruntfile: {
                src: 'Gruntfile.js'
            },
            lib: {
                src: ['lib/**/*.js']
            },
            test: {
                src: ['test/**/*.js']
            }
        },
        mocha_debug: {
            options: {
                check: 'test/**/*.js',
                reporter: 'tap'
            }
        },
        watch: {
            gruntfile: {
                files: '<%= jshint.gruntfile.src %>',
                tasks: ['jshint:gruntfile']
            },
            lib: {
                files: '<%= jshint.lib.src %>',
                tasks: ['simplemocha', ]
            },
            test: {
                files: '<%= jshint.test.src %>',
                tasks: ['simplemocha']
            }
        },
        'node-inspector': {
            dev: {}
        }
    });
    grunt.loadNpmTasks('grunt-debug');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-mocha-debug');
    grunt.loadNpmTasks('grunt-simple-mocha');
    grunt.loadNpmTasks('grunt-node-inspector');
    grunt.loadNpmTasks('grunt-nodemon');
    // Default task.
    //grunt.registerTask('default', ['simplemocha', 'node-inspector', 'watch']);
    grunt.registerTask('default', ['simplemocha:all']);
    //registeing test files
    testFiles.forEach(function(item) {
        var name = item.replace(/(test-[0-9\.]+-|\.js)/g,'');
        grunt.registerTask('test-'+name, ['simplemocha:'+name]);
    });
};
