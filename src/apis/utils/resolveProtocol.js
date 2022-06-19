import store from '../../store'

export const resolveProtocol = function (host) {
  const result = new URL(host)
  result.protocol = store.state.storage.isUseHttps ? 'https' : 'http'
  return result.href
}
