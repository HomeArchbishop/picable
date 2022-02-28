import { sanitizeUrl } from '@braintree/sanitize-url'

export const formatImgUrl = function (fileServer = '', path = '') {
  const unsafeResult = fileServer.slice(0, 1) === '@'
    ? /* TODO: downloaded image */ `https://storage1.picacomic.com/static/${path}`
    : `https://storage1.picacomic.com/static/${path}`
  return sanitizeUrl(unsafeResult)
}
