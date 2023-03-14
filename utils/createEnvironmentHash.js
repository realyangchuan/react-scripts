'use strict'
const { createHash } = require('node:crypto')

function createEnvironmentHash(env) {
  const hash = createHash('md5')
  hash.update(JSON.stringify(env))

  return hash.digest('hex')
}

module.exports = createEnvironmentHash
