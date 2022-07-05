import Header from './header'
import { resolveURL } from '../utils/resolveURL'
import axios from 'axios'
import Swal from '../../assets/utils/sweetalert-picable'
import { resolveProtocol } from '../utils/resolveProtocol'

// returns parsed json
/*
const sendRequest = async function ({
  diversionUrl, subUrl, method, body, token = '', excludeStatus = []
}) {
  const header = new Header(subUrl, method, token)
  const url = resolveURL(diversionUrl, subUrl)
  console.log(method, url)

  const fetchOption = {
    headers: header.headers,
    method,
    [method === 'POST' && 'body']: JSON.stringify(body || {})
  }
  const resp = await fetch(url, fetchOption)

  if (resp.status !== 200 && !excludeStatus.includes(resp.status)) {
    const errJson = {
      errType: 'apiProxy',
      errApiUrl: url,
      errObj: await resp.json()
    }
    const errStr = JSON.stringify(errJson)
    throw new Error(errStr)
  }

  const respData = await resp.json()
  return respData
}
*/

const sendRequest = async function ({
  diversionUrl, subUrl, method, body, token = '', excludeStatus = []
}) {
  const header = new Header(subUrl, method, token)

  const url = resolveURL(resolveProtocol(diversionUrl), subUrl)
  console.log(method, url)

  const axiosOption = {
    headers: header.headers,
    url: subUrl,
    baseURL: resolveProtocol(diversionUrl),
    method,
    timeout: 6000,
    [method === 'POST' && 'data']: body,
    validateStatus (status) {
      return (status >= 200 && status < 300) || excludeStatus.includes(status)
    }
  }
  const requestApp = axios.create()
  requestApp.interceptors.response.use(/* status codes match 2xx */r => r, error => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      Swal.fire({
        title: '哔咔报告错误',
        html: `错误详情<br>${JSON.stringify(error.response.data)}`,
        icon: 'error'
      })
    } else if (error.request) {
      // The request was made but no response was received
      Swal.fire({
        title: '啊嘞，请求错误诶...',
        html: `请尝试如下几种解决方案<br>1.检查网络连接<br>2.重启应用<br>3.无法解决时，将此截图反馈给开发者<br>
          错误详情<br>${JSON.stringify(error.message)}<br>${JSON.stringify(error.request)}`,
        icon: 'error'
      })
    } else {
      // Something happened in setting up the request that triggered an Error
      Swal.fire({
        title: '哔咔被玩坏了...',
        html: `发生未知错误<br>
          错误详情<br>${JSON.stringify(error.message)}`,
        icon: 'error'
      })
    }
    return Promise.reject(error)
  })
  const resp = await requestApp(axiosOption)

  const respData = resp.data
  return respData
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

const sendPut = async function ({
  diversionUrl, subUrl, body, token, excludeStatus = []
}) {
  const data = await sendRequest({
    diversionUrl,
    subUrl,
    method: 'PUT',
    body,
    token,
    excludeStatus
  })
  return data
}

const sendPost = async function ({
  diversionUrl, subUrl, body, token, excludeStatus = []
}) {
  const data = await sendRequest({
    diversionUrl,
    subUrl,
    method: 'POST',
    body,
    token,
    excludeStatus
  })
  return data
}

export { sendGet, sendPost, sendPut }
