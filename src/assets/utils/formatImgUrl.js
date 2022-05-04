import { sanitizeUrl } from '@braintree/sanitize-url'

export const formatImgUrl = function (fileServer = '', path = '') {
  const unsafeResult = fileServer.slice(0, 1) === '@'
    ? path
    : new URL(path, 'https://storage1.picacomic.com/static/').toString()
  return fileServer.slice(0, 1) === '@' ? unsafeResult : sanitizeUrl(unsafeResult)
}
