'use strict'

process.on('unhandledRejection', err => {
  throw err
})

process.env.NODE_ENV = 'production'
process.env.BABEL_ENV = 'production'

require('../config/env')
const paths = require('../config/paths')
const webpack = require('webpack')
const fs = require('fs-extra')
const configFactory = require('../config/webpack.config')

const config = configFactory('production')
const compiler = webpack(config)
compiler.run((err, stats) => {
  fs.copySync(paths.appPublic, paths.appBuild, {
    dereference: true,
    filter: file => file !== paths.appHtml
  })

  let messages
  if (err) {
    messages = {
      errors: [err.message],
      warnings: []
    }
  } else {
    messages = stats.toJson({ all: false, errors: true, warnings: true })
  }

  if (messages.errors?.length) {
    console.log(messages.errors.join('\n\n'))
  }
})
