import { isArray } from 'lodash'

import config from '../configs'
import axios from 'axios'

async function getDiversionUrlList () {
  const requestData = (await axios.get('http://68.183.234.72/init')).data // this URL needn't to resolve protocol
  const otherDiversionList = isArray(requestData.addresses)
    ? requestData.addresses.map(ip => `http://${ip}/`) : []
  const fullList = [config.baseURL, ...otherDiversionList]
  return fullList
}

export {
  getDiversionUrlList
}
