import * as uuid from 'uuid'
import * as crypto from 'crypto'

const apiKey = 'C69BAF41DA5ABD1FFEDC6D2FEA56B'
const shaKey = '~d}$Q7$eIni=V)9\\RK/P.RM4;9[7|@/CA}b~OW!3?EV`:<>M7pddUBL5n|0/*Cn'

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
      accept: 'application/vnd.picacomic.com.v1+json',
      signature: this.createSignature(url, time, nonce, method),
      // host: 'picaapi.picacomic.com',  // TODO solve ths HOST safety problem
      authorization: auth,
      'app-channel': '1',
      'api-key': apiKey,
      'app-version': '2.2.1.3.3.4',
      'app-uuid': 'cb69a7aa-b9a8-3320-8cf1-74347e9ee970',
      'image-quality': 'original',
      'app-platform': 'android',
      'app-build-version': '45',
      // 'User-Agent': 'okhttp/3.8.1', // we have already set UA properly in electron background.js
      'Content-Type': 'application/json; charset=UTF-8'
    }
  }
}

export default Header
