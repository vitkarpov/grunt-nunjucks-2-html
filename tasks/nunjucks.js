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

/**
 * Promsify Nunjucks render
 * @param {object} env    Nunjucks configured environment
 * @param {string} src    Path to the template
 * @param {object} [data] Template context
 * @return {promise}
 */
const render = (env, src, data) => new Promise((resolve, reject) => {
  env.render(src, data, (error, rendered) => {
    if (error) return reject(error)
    return resolve(rendered)
  })
})

/**
 * Prepare data by cloning it to avoid leaks and processing it
 * through relevant function
 * @param {object}   options                  Task options
 * @param {object}   [options.data]           Template context
 * @param {function} [options.preprocessData] Processor for context
 * @param {object}   file                     Current `this.files` `file` instance
 * @return {object} Prepared data
 */
const prepareData = (options, file) => {
  let data = Object.assign({}, options.data)

  if (options.data && typeof options.preprocessData === 'function') {
    data = options.preprocessData.call(file, data)
  }

  return data
}

module.exports = function (grunt) {
  grunt.registerMultiTask('nunjucks', `Renders Nunjucks' templates to HTML`, function () {
    const done = this.async()

    // Get options and set defaults
    const options = this.options({
      watch: false,
      paths: '',
      configureEnvironment: false,
      data: false,
      preprocessData: false,
      noCache: true
    })

    const total = this.files.length

    if (!total) {
      grunt.log.error('No files specified.')
      return done()
    }

    if (!options.data) {
      grunt.log.error(`Template's data is empty. Guess you've forget to specify data option.`)
    }

    const env = nunjucks.configure(options.paths, options)

    if (typeof options.configureEnvironment === 'function') {
      options.configureEnvironment.call(this, env, nunjucks)
    }

    let success = 0
    let errors = 0

    const renderFiles = this.files.reduce((files, file) => {
      let filedest = file.dest

      if (!filedest) {
        grunt.log.error(`No dest file specified`)
        done()
      }

      if (!file.src || !file.src.length) {
        grunt.log.error(`No source files specified for ${chalk.cyan(filedest)}.`)
        done()
      }

      const renders = file.src.map((src) => new Promise((resolve, reject) =>
        render(env, path.resolve(src), prepareData(options, file))
          .then((rendered) => {
            grunt.file.write(filedest, rendered)
            success++
          })
          .catch((error) => {
            grunt.log.error(error)
            errors++
          })
          .then(() => resolve())
      ))

      return files.concat(renders)
    }, [])

    Promise.all(renderFiles)
      .then(() => {
        const isWrong = success !== total
        const logColor = isWrong ? 'error' : 'ok'
        const totalColor = isWrong ? 'red' : 'green'

        grunt.log[logColor](`${chalk[totalColor](success)}/${chalk.cyan(total)} files rendered`)

        if (isWrong) throw new Error(`Failed to compile ${errors} ${grunt.util.pluralize(errors, 'file/files')}.\nSee log above for details.`)

        done()
      })
      .catch((error) => done(error))
  })
}
