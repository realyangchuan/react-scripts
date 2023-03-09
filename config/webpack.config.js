'use strict'

module.exports = (webpackEnv) => {
  return {
    mode: webpackEnv,
    output: {
      clean: true
    }
  }
}
