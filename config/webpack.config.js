'use strict'

const path = require('node:path')
const getClientEnvironment = require('../config/env')
const paths = require('../config/paths')

module.exports = (webpackEnv) => {
  const isEnvDevelopment = webpackEnv === 'development'
  const isEnvProduction = webpackEnv === 'production'
  const env = getClientEnvironment(paths.publicUrlOrPath.slice(0, -1))
  const shouldUseReactRefresh = env.raw.FAST_REFRESH
  const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false'

  return {
    mode: webpackEnv,
    target: ['browserslist'],
    stats: 'errors-warnings',
    bail: isEnvProduction,
    devtool: isEnvProduction
      ? shouldUseSourceMap
        ? 'source-map'
        : false
      : 'cheap-module-source-map',
    entry: paths.appIndexJs,
    output: {
      path: paths.appBuild,
      pathinfo: isEnvDevelopment,
      filename: isEnvProduction
        ? 'static/js/[name].[contenthash:8].js'
        : 'static/js/bundle.js',
      chunkFilename: isEnvProduction
        ? 'static/js/[name].[contenthash:8].chunk.js'
        : 'static/js/[name].chunk.js',
      assetModuleFilename: 'static/media/[name].[hash][ext]',
      publicPath: paths.publicUrlOrPath,
      devtoolModuleFilenameTemplate: isEnvProduction
        ? info =>
          path
            .relative(paths.appSrc, info.absoluteResourcePath)
            .replace(/\\/g, '/')
        : info => path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
      clean: true
    }
  }
}
