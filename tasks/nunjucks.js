/*
 * grunt-nunjucks-2-html
 * https://github.com/vitkarpov/grunt-nunjucks-2-html
 *
 * Copyright (c) 2014 Vit Karpov
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {
    var nunjucks = require('nunjucks');
    var path = require('path');

    grunt.registerMultiTask('nunjucks', 'Render nunjucks template to HTML', function() {
        var options = this.options();

        nunjucks.configure(options.templatesFolder);

        this.files.forEach(function(f) {
            var filepath = path.normalize(f.src[0]);

            if (!grunt.file.exists(filepath)) {
                grunt.log.warn('Template file "' + filepath + '" not found.');
                return false;
            }

            var compiledHtml = nunjucks.render(path.basename(filepath), options.data || {});

            grunt.file.write(f.dest, compiledHtml);
            grunt.log.writeln('File "' + f.dest + '" created.');
        });
    });
};