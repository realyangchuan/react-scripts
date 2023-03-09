'use strict'

process.on('unhandledRejection', err => {
  throw err
})

process.env.NODE_ENV = 'development'
process.env.BABEL_ENV = 'development'

require('../config/env')
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const configFactory = require('../config/webpack.config')

const config = configFactory('development')
const compiler = webpack(config)
const devServer = new WebpackDevServer(
  {
    host: process.env.HOST || '0.0.0.0',
    port: process.env.PORT || 3000
  },
  compiler
)
devServer.startCallback(() => {
  console.log('Starting the development server...\n')
})

;['SIGINT', 'SIGTERM'].forEach(sig => {
  process.on(sig, () => {
    devServer.close()
    process.exit()
  })
})
