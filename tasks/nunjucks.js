/*
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

        this.files.forEach(function(f) {
            var filepath = path.resolve(__dirname, '../../../', f.src[0]);

            if (!grunt.file.exists(filepath)) {
                grunt.log.warn('Template`s file "' + filepath + '" not found.');
                return false;
            }

            if (!options.data) {
                grunt.log.warn('Template`s data is empty. Guess you forget to specify data option');
            }

            var data = (typeof options.preprocessData === 'function')
                ? options.preprocessData.call(f, options.data || {})
                : options.data || {};

            var template = grunt.file.read(filepath);
            
            if (Array.isArray(options.paths) && options.paths.length) {
              nunjucks.configure(options.paths);
            }
            
            var compiledHtml = nunjucks.renderString(template, data);

            grunt.file.write(f.dest, compiledHtml);
            grunt.log.writeln('File "' + f.dest + '" created.');
        });
    });
};
