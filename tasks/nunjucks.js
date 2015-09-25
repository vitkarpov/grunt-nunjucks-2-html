/**
 * grunt-nunjucks-2-html
 * https://github.com/vitkarpov/grunt-nunjucks-2-html
 *
 * Copyright (c) 2014 Vit Karpov
 * Licensed under the MIT license.
 */

'use strict'

const nunjucks = require('nunjucks')
const chalk = require('chalk')
const path = require('path')

module.exports = function (grunt) {

    grunt.registerMultiTask('nunjucks', 'Renders nunjucks\' template to HTML', function () {
        // Declare async task
        const completeTask = this.async()

        // Get options and set defaults
        // @note We're using `undefined` to fallback to Nunjucks' default settings
        const options = this.options({
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
        const env = nunjucks.configure(options.paths, {
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
        const totalFiles = this.files.length
        // Start counter for number of compiled files
        let countCompiled = 0

        new Promise((resolve, reject) => {

            // Iterate over all files' groups
            this.files.forEach(file => {
                // Set destination
                let filedest = file.dest

                // Check whether there are any source files
                if (!file.src.length) {
                    grunt.log.error('No source files specified for ' + chalk.cyan(filedest))

                    // Skip to next file — nothing we can do without specified source files
                    return reject('For some destinations were not specified source files')
                }

                // Iterate over files' sources
                file.src.forEach(src => {
                    // Сheck whether source file exists
                    if (!grunt.file.exists(src)) {
                        grunt.log.error('Source file ' + chalk.cyan(src) + ' for ' + chalk.cyan(filedest) + ' not found.')

                        // Skip to next source file — nothing we can do with non-existing file
                        return reject('Some source files were not found')
                    }

                    // Construct absolute path to file for Nunjucks
                    let filepath = path.join(process.cwd(), src)

                    let data = {}
                    // Work with data only there is any data
                    if (options.data) {
                        // Clone data
                        for (let i in options.data) {
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
                    env.render(filepath, data, (err, res) => {
                        // Catch errors, warn
                        if (err) {
                            grunt.log.error(err)
                            grunt.fail.warn('Failed to compile one of the source files.')
                            grunt.log.writeln()

                            // Prevent writing of failed to compile file, skip to next file
                            return reject('Failed to compile some source files')
                        }

                        // Write rendered template to destination
                        grunt.file.write(filedest, res)

                        // Debug process
                        grunt.verbose.ok('File ' + chalk.cyan(filedest) + ' created.')
                        grunt.verbose.writeln()

                        countCompiled++
                    })
                })
            })

            // Finish Promise
            resolve()
        })

        // Print any errors from rejects
        .catch(err => {
            if (err) {
                grunt.log.writeln()
                grunt.log.error(err)
                grunt.log.writeln()
            }
        })

        // Log number of processed templates
        .then(() => {
            // Log number of processed templates
            let logType            = (countCompiled === totalFiles) ? 'ok' : 'error'
            let countCompiledColor = (countCompiled === totalFiles) ? 'green' : 'red'
            grunt.log[logType](chalk[countCompiledColor](countCompiled) + '/' + chalk.cyan(totalFiles) + ' ' + grunt.util.pluralize(totalFiles, 'file/files') + ' compiled.')
        })

        // Finish async task
        completeTask()
    })
}
