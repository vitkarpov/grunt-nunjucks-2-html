/**
 * grunt-nunjucks-2-html
 * https://github.com/vitkarpov/grunt-nunjucks-2-html
 *
 * Copyright (c) 2014 Vit Karpov
 * Licensed under the MIT license.
 */

'use strict';

var nunjucks = require('nunjucks');
var path = require('path');

module.exports = function(grunt) {

    grunt.registerMultiTask('nunjucks', 'Renders nunjucks` template to HTML', function() {
        var options = this.options();
        var completeTask = this.async();

        if (!this.files.length) {
            grunt.log.error('No files specified.');

            return completeTask()
        }

        if (!options.data) {
            grunt.log.error('Template`s data is empty. Guess you forget to specify data option');
        }

        var envOptions = { watch: false };
        if (options.tags) {
            envOptions.tags = options.tags;
        }

        var basePath = options.paths || '';
        var env = nunjucks.configure(basePath, envOptions);

        if (typeof options.configureEnvironment === 'function') {
            options.configureEnvironment.call(this, env, nunjucks);
        }

        this.files.forEach(function(file) {
            var filedest = file.dest;

            if (!file.src.length) {
                grunt.log.error('No source files specified for ' + filedest);

                return
            }

            file.src.forEach(function(src) {
                if (!grunt.file.exists(src)) {
                    grunt.log.error('Source file ' + src + ' for ' + filedest + ' not found.');

                    return
                }

                var filepath = path.join(process.cwd(), src);

                // We need to clone the data
                var data = {};
                for (var i in options.data) {
                    if (options.data.hasOwnProperty(i)) {
                        data[i] = options.data[i];
                    }
                }

                if (typeof options.preprocessData === 'function') {
                    data = options.preprocessData.call(file, data);
                }

                env.render(filepath, data, function(err, res) {
                    if (err) {
                        grunt.log.error(err);
                        grunt.fail.warn('Failed to compile one of the sources.');
                        grunt.log.writeln();

                        return
                    }
                    grunt.file.write(filedest, res);

                    grunt.verbose.ok('File "' + filedest + '" created.');
                    grunt.verbose.writeln();
                });
            });
        });

        completeTask();
    });
};
