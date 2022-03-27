import * as uuid from 'uuid'
import * as crypto from 'crypto'
import config from '../../../configs'

const apiKey = config.apiKey
const shaKey = config.shaKey

class Header {
  createSignature (url, time, nonce, method) {
    const tmp = url + time + nonce + method + apiKey
    const tmpLower = tmp.toLowerCase()
    return crypto.createHmac('SHA256', shaKey).update(tmpLower).digest('hex')
  }

  // url: request url without https://picaapi.picacomic.com/
  // method: choose one from methods[] array
  constructor (url, method, auth) {
    const time = (Date.now() / 1000).toFixed(0)
    const nonce = uuid.v4().replace(/-/g, '')
    this.headers = {
      time,
      nonce,
      accept: config.accept,
      signature: this.createSignature(url, time, nonce, method),
      // host: 'picaapi.picacomic.com',  // TODO solve ths HOST safety problem
      authorization: auth,
      'app-channel': config['app-channel'],
      'api-key': apiKey,
      'app-version': config['app-version'],
      'app-uuid': config['app-uuid'],
      'image-quality': config['image-quality'],
      'app-platform': config['app-platform'],
      'app-build-version': config['app-build-version'],
      // 'User-Agent': 'okhttp/3.8.1', // we have already set UA properly in electron background.js
      'Content-Type': config['Content-Type']
    }
  }
}

export default Header
