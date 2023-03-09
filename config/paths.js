'use strict'

const path = require('node:path')
const fs = require('node:fs')
const getPublicUrlOrPath = require('../utils/getPublicUrlOrPath')

const appDir = fs.realpathSync(process.cwd())
const resolveApp = relativePath => path.resolve(appDir, relativePath)
const publicUrlOrPath = getPublicUrlOrPath(
  process.env.NODE_ENV === 'development',
  process.env.PUBLIC_URL
)
const buildPath = process.env.BUILD_PATH || 'dist'

const moduleFileExtensions = ['mjs', 'js', 'jsx', 'ts', 'tsx', 'json']
const resolveModule = (resolveFn, filePath) => {
  const extension = moduleFileExtensions.find(
    extension => fs.existsSync(resolveFn(`${filePath}.${extension}`))
  )

  if (extension) {
    return resolveFn(`${filePath}.${extension}`)
  }

  return resolveFn(`${filePath}.js`)
}

module.exports = {
  dotenv: resolveApp('.env'),
  appPath: resolveApp('.'),
  appBuild: resolveApp(buildPath),
  appPublic: resolveApp('public'),
  appHtml: resolveApp('public/index.html'),
  appIndexJs: resolveModule(resolveApp, 'src/index'),
  appPackageJson: resolveApp('package.json'),
  appSrc: resolveApp('src'),
  appTsConfig: resolveApp('tsconfig.json'),
  appJsConfig: resolveApp('jsconfig.json'),
  proxySetup: resolveApp('src/setupProxy.js'),
  publicUrlOrPath
}

module.exports.moduleFileExtensions = moduleFileExtensions
