/**
 * grunt-nunjucks-2-html
 * https://github.com/vitkarpov/grunt-nunjucks-2-html
 *
 * Copyright (c) 2014 Vit Karpov
 * Licensed under the MIT license.
 */

'use strict'

var nunjucks = require('nunjucks')
var chalk = require('chalk')
var path = require('path')

module.exports = function (grunt) {

    grunt.registerMultiTask('nunjucks', 'Renders nunjucks\' template to HTML', function () {
        // Declare async task
        var completeTask = this.async()

        // Get options and set defaults
        // @note We're using `undefined` to fallback to Nunjucks' default settings
        var options = this.options({
            paths                : '',
            autoescape           : undefined,
            throwOnUndefined     : undefined,
            trimBlocks           : undefined,
            lstripBlocks         : undefined,
            noCache              : undefined,
            tags                 : undefined,
            configureEnvironment : false,
            data                 : false,
            preprocessData       : false
        })

        // Finish task if no files specified
        if (!this.files.length) {
            grunt.log.error('No files specified.')

            // Finish task — nothing we can do without specified files
            return completeTask()
        }

        // Warn in case of undefined data
        if (!options.data) {
            grunt.log.error('Template\'s data is empty. Guess you forget to specify data option')
        }

        // Arm Nunjucks
        var env = nunjucks.configure(options.paths, {
            watch            : false,
            autoescape       : options.autoescape,
            throwOnUndefined : options.throwOnUndefined,
            trimBlocks       : options.trimBlocks,
            lstripBlocks     : options.lstripBlocks,
            noCache          : options.noCache,
            tags             : options.tags
        })

        // Pass configuration to Nunjucks if specified
        if (typeof options.configureEnvironment === 'function') {
            options.configureEnvironment.call(this, env, nunjucks)
        }

        // Get number of files
        var totalFiles = this.files.length
        // Start counter for number of compiled files
        var countCompiled = 0

        // Iterate over all files' groups
        this.files.forEach(function (file) {
            // Set destination
            var filedest = file.dest

            // Check whether there are any source files
            if (!file.src.length) {
                grunt.log.error('No source files specified for ' + chalk.cyan(filedest))

                // Skip to next file — nothing we can do without specified source files
                return
            }

            // Iterate over files' sources
            file.src.forEach(function (src) {
                // Сheck whether source file exists
                if (!grunt.file.exists(src)) {
                    grunt.log.error('Source file ' + chalk.cyan(src) + ' for ' + chalk.cyan(filedest) + ' not found.')

                    // Skip to next source file — nothing we can do with non-existing file
                    return
                }

                // Construct absolute path to file for Nunjucks
                var filepath = path.join(process.cwd(), src)

                var data = {}
                // Work with data only there is any data
                if (options.data) {
                    // Clone data
                    for (var i in options.data) {
                        if (options.data.hasOwnProperty(i)) {
                            data[i] = options.data[i]
                        }
                    }

                    // Preprocess data
                    if (typeof options.preprocessData === 'function') {
                        data = options.preprocessData.call(file, data)
                    }
                }

                // Asynchronously render templates with configurated Nunjucks environment
                // and write to destination
                env.render(filepath, data, function (err, res) {
                    // Catch errors, warn
                    if (err) {
                        grunt.log.error(err)
                        grunt.fail.warn('Failed to compile one of the source files.')
                        grunt.log.writeln()

                        // Prevent writing of failed to compile file, skip to next file
                        return
                    }

                    // Write rendered template to destination
                    grunt.file.write(filedest, res)

                    // Debug process
                    grunt.verbose.ok('File ' + chalk.cyan(filedest) + ' created.')
                    grunt.verbose.writeln()
                })

                countCompiled++
            })
        })

        // Log number of processed templates
        var logType            = (countCompiled === totalFiles) ? 'ok' : 'error'
        var countCompiledColor = (countCompiled === totalFiles) ? 'green' : 'red'
        grunt.log[logType](chalk[countCompiledColor](countCompiled) + '/' + chalk.cyan(totalFiles) + ' ' + grunt.util.pluralize(totalFiles, 'file/files') + ' compiled.')

        // Finish async task
        completeTask()
    })
}
