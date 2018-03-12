'use strict'

const path = require('path')
const tests = ['base', 'leaking-vars', 'autoescape', 'async']

tests.forEach(function (folder) {
  require(path.join(__dirname, folder))()
})
