'use strict'

function getPublicUrlOrPath(isDevelopment, envPublicUrl) {
  const baseUrl = 'https://realyangchuan.com'

  if (envPublicUrl) {
    envPublicUrl = envPublicUrl.endsWith('/') ? envPublicUrl : `${envPublicUrl}/`
    const validPublicUrl = new URL(envPublicUrl, baseUrl)

    return isDevelopment
      ? envPublicUrl.startsWith('.')
        ? '/'
        : validPublicUrl.pathname
      : envPublicUrl
  }

  return '/'
}

module.exports = getPublicUrlOrPath
