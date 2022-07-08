/* eslint-disable quote-props */
import Header from './header'
import { resolveURL } from '../utils/resolveURL'
import axios from 'axios'
import { swal } from '../../plugins/sweetalert-picable/sweetalert-picable'
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
    timeout: 10000,
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
      swal.toast.error.fire({
        title: '哔咔报告错误',
        html: `<details>
          <summary>错误详情</summary>
          ${JSON.stringify(error.response.data)}
          </details>`
      })
    } else if (error.request) {
      // The request was made but no response was received
      swal.toast.error.fire({
        title: '网络错误，请检查网络和代理',
        html: `发生未知错误<details>
          <summary>可能解决方案</summary>
          <ol><li>检查网络和代理连接</li><li>重启应用</li><li>无法解决时，将错误详情反馈给开发者</li></ol>
          </details><details><summary>错误详情</summary>
          ${JSON.stringify(error.message)}<br>${JSON.stringify(error.request)}`
      })
    } else {
      // Something happened in setting up the request that triggered an Error
      swal.modal.error.fire({
        title: '未知错误',
        html: `<details>
        <summary>错误详情</summary>
        ${JSON.stringify(error.message)}</details>`
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
