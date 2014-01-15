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

    grunt.registerMultiTask('nunjucks', 'Render nunjucks template to HTML', function() {
        var opts = this.options();

        var files = this.files.forEach(function(f) {
            var filename = f.src;

            if (!grunt.file.exists(filename)) {
                grunt.log.warn('Template file "' + filename + '" not found.');
                return false;
            }

            var compiledHtml = nunjucks.render(this.options.data || {});

            grunt.file.write(f.dest, compiledHtml);
            grunt.log.writeln('File "' + f.dest + '" created.');
        });
    });
};