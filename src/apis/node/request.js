
import Header from './header'
import { resolveURL } from '../utils/resolveURL'
import axios from 'axios'

const resolveProtocol = function (host) {
  const result = new URL(host)
  result.protocol = 'https'
  return result.href
}

const sendRequest = async function ({
  diversionUrl, subUrl, method, token = ''
}) {
  const header = new Header(subUrl, method, token)

  console.log(method, resolveURL((diversionUrl), subUrl))

  const axiosOption = {
    headers: header.headers,
    baseURL: resolveProtocol(diversionUrl),
    url: subUrl,
    method,
    timeout: 48000,
    maxRedirects: 10
  }
  const resp = await axios.request(axiosOption)
  return resp.data
}

const sendGet = async function ({
  diversionUrl, subUrl, token, excludeStatus = []
}) {
  const data = await sendRequest({
    diversionUrl,
    subUrl,
    method: 'GET',
    token,
    excludeStatus
  })
  return data
}

export { sendGet }
