'use strict'

process.on('unhandledRejection', err => {
  throw err
})

process.env.NODE_ENV = 'development'
process.env.BABEL_ENV = 'development'
