'use strict'

process.on('unhandledRejection', err => {
  throw err
})

process.env.NODE_ENV = 'production'
process.env.BABEL_ENV = 'production'
