'use strict'

const path = require('node:path')
const fs = require('node:fs')
const TerserPlugin = require('terser-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin')
const getClientEnvironment = require('../config/env')
const createEnvironmentHash = require('../utils/createEnvironmentHash')
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
      // There will be one main bundle, and one of file per asyncchronous chunk.
      // In development, it does not produce real files.
      filename: isEnvProduction
        ? 'static/js/[name].[contenthash:8].js'
        : 'static/js/bundle.js',
      // Additional JS chunk files when use code spliting
      chunkFilename: isEnvProduction
        ? 'static/js/[name].[contenthash:8].chunk.js'
        : 'static/js/[name].chunk.js',
      assetModuleFilename: 'static/media/[name].[hash][ext]',
      // webpack uses `publicPath` to determine where the app is being served from.
      // It requires a trailing slash, or the file assets will get an incorrect path.
      // we inferred the `public path` (such as / or /my-project) from homepage.
      publicPath: paths.publicUrlOrPath,
      // Point sourcemap entries to original disk location (format as URL on Windows)
      devtoolModuleFilenameTemplate: isEnvProduction
        ? info =>
          path
            .relative(paths.appSrc, info.absoluteResourcePath)
            .replace(/\\/g, '/')
        : info => path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
      clean: true
    },
    cache: {
      type: 'filesystem',
      version: createEnvironmentHash(env.raw),
      cacheDirectory: paths.appWebpackCache,
      store: 'pack',
      buildDependencies: {
        config: [__filename],
        tsconfig: [paths.appTsConfig, paths.appJsConfig].filter(f => fs.existsSync(f))
      },
      compression: isEnvProduction
        ? 'brotli'
        : isEnvDevelopment && false,
      hashAlgorithm: 'md5'
    },
    // infrastructureLogging: {
    //   level: 'none'
    // },
    optimization: {
      minimize: isEnvProduction,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            // parse: {
            //   ecma: 8
            // },
            compress: {
              ecma: 5,
              warnings: false,
              comparisons: false,
              inline: 2
            },
            mangle: {
              safari10: true
            },
            keep_classnames: false,
            keep_fnames: false,
            output: {
              ecma: 5,
              comments: false,
              ascii_only: true
            }
          }
        }),
        new CssMinimizerPlugin()
      ]
    },
    resolve: {
      alias: {
        src: paths.appSrc,
        '@': paths.appSrc
      },
      plugins: [
        new ModuleScopePlugin(paths.appSrc, [paths.appPackageJson])
      ]
    }
  }
}
