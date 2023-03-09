'use strict'

const fs = require('node:fs')
const paths = require('./paths')
delete require.cache[require.resolve('./paths')]

const args = process.argv.slice(2)

let mode = process.env.NODE_ENV
args.find((arg, i) => {
  if (arg === '-m' || arg === '--mode') {
    mode = args[i + 1] || ''
    return true
  } else {
    const [name, val] = arg.split('=')
    if (['--mode', '-m'].includes(name)) {
      mode = val ?? ''
      return true
    }
  }

  return false
})

let dotenvFiles = []
if (!mode) {
  dotenvFiles = [
    `${paths.dotenv}.local`,
    paths.dotenv
  ]
} else {
  dotenvFiles = [
    `${paths.dotenv}.${mode}.local`,
    mode !== 'test' && `${paths.dotenv}.local`,
    `${paths.dotenv}.${mode}`,
    paths.dotenv
  ].filter(Boolean)
}

dotenvFiles.forEach(dotenvFile => {
  if (fs.existsSync(dotenvFile)) {
    require('dotenv-expand').expand(
      require('dotenv').config({
        path: dotenvFile
      })
    )
  }
})

const REACT_APP = /^REACT_APP_/i
function getClientEnvironment(publicUrl) {
  const raw = Object.keys(process.env)
    .filter(k => REACT_APP.test(k))
    .reduce(
      (env, key) => {
        env[key] = process.env(key)
        return env
      },
      {
        NODE_ENV: process.env.NODE_ENV,
        PUBLIC_URL: publicUrl,
        FAST_REFRESH: true
      }
    )
  const stringified = {
    'process.env': Object.keys(raw).reduce((env, key) => {
      env[key] = JSON.stringify(raw[key])
      return env
    }, {})
  }

  return { raw, stringified }
}

module.exports = getClientEnvironment
