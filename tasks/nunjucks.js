/*
 * grunt-nunjucks-2-html
 * https://github.com/vitkarpov/grunt-nunjucks-2-html
 *
 * Copyright (c) 2014 Vit Karpov
 * Licensed under the MIT license.
 */

var nunjucks = require('nunjucks');
var path = require('path');

module.exports = function(grunt) {
    'use strict';

    grunt.registerMultiTask('nunjucks', 'Renders nunjucks` template to HTML', function() {
        var options = this.options();

        if (!options.data) {
            grunt.log.warn('Template`s data is empty. Guess you forget to specify data option');
        }

        var envOptions = { watch: false };
        if (options.tags) {
            envOptions.tags = options.tags;
        }

        var basePath = options.paths || '';
        var env = nunjucks.configure(basePath, envOptions);

        if (typeof this.options.configureEnvironment === 'function') {
            this.options.configureEnvironment(env);
        }

        this.files.forEach(function(f) {
            var filepath = path.join(process.cwd(), f.src[0]);

            if (!grunt.file.exists(filepath)) {
                grunt.log.warn('Template`s file "' + filepath + '" not found.');
                return false;
            }

            var data = (typeof options.preprocessData === 'function')
                ? options.preprocessData.call(f, options.data || {})
                : options.data || {};

            var template = grunt.file.read(filepath);
            var compiledHtml = nunjucks.renderString(template, data);

            grunt.file.write(f.dest, compiledHtml);
            grunt.log.writeln('File "' + f.dest + '" created.');
        });
    });
};
