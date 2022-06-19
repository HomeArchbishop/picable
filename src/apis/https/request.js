import Header from './header'
import { resolveURL } from '../utils/resolveURL'
import axios from 'axios'
import swal from 'sweetalert'
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
    [method === 'POST' && 'data']: body
  }
  const requestApp = axios.create()
  requestApp.interceptors.response.use(/* status codes match 2xx */r => r, error => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      if (excludeStatus.includes(error.response.status)) {
        return error.response
      }
      swal({
        title: '哔咔报告错误',
        text: `错误详情\n${JSON.stringify(error.response.data)}`,
        icon: 'error'
      })
    } else if (error.request) {
      // The request was made but no response was received
      swal({
        title: '啊嘞，请求错误诶...',
        text: `请尝试如下几种解决方案\n1.检查网络连接\n2.重启应用\n3.无法解决时，将此截图反馈给开发者\n
          错误详情\n${JSON.stringify(error.message)}\n${JSON.stringify(error.request)}`,
        icon: 'error'
      })
    } else {
      // Something happened in setting up the request that triggered an Error
      swal({
        title: '哔咔被玩坏了...',
        text: `发生未知错误\n
          错误详情\n${JSON.stringify(error.message)}`,
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
