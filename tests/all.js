'use strict'

const path = require('path')
const tests = ['base', 'leaking-vars']

tests.forEach((folder) => require(path.join(__dirname, folder)))
