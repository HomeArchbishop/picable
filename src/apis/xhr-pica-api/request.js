import qs from 'qs'
import Header from './header'
import { resolveURL } from '../utils/resolveURL'
import axios from 'axios'
import { swal } from '../../plugins/sweetalert-picable/sweetalert-picable'
import { resolveProtocol } from '../utils/resolveProtocol'

import router from '../../router'

// all the pending request will set in this map
// Map be like { reqKey: AbortController }
const pendingRequest = new Map()

function generateReqKey (config) {
  const { method, url, params, data } = config
  return [method, url, qs.stringify(params), qs.stringify(data)].join('&')
}
const addPendingRequest = (config) => {
  const requestKey = generateReqKey(config)
  const abortController = new AbortController()
  config.signal = abortController.signal
  if (!pendingRequest.has(requestKey)) {
    pendingRequest.set(requestKey, abortController)
  }
}
const removePendingRequest = (config) => {
  const requestKey = generateReqKey(config)
  pendingRequest.delete(requestKey)
}
const abortPendingRequest = (config) => {
  const requestKey = generateReqKey(config)
  if (pendingRequest.has(requestKey)) {
    const abortController = pendingRequest.get(requestKey)
    pendingRequest.delete(requestKey)
    abortController.abort()
  }
}
const abortPendingRequestAll = () => {
  pendingRequest.forEach(abortController => abortController.abort())
}

const sendRequest = async function ({
  diversionUrl, subUrl, method, body, token = '', excludeStatus = []
}) {
  const header = new Header(subUrl, method, token)

  console.log(method, resolveURL(resolveProtocol(diversionUrl), subUrl))

  const picaAxiosInstance = axios.create()
  picaAxiosInstance.interceptors.request.use(
    config => {
      abortPendingRequest(config)
      addPendingRequest(config)
      return config
    },
    error => Promise.reject(error)
  )
  picaAxiosInstance.interceptors.response.use(
    /* status validate */resp => {
      removePendingRequest(resp.config)
      console.log('resp')
      return resp
    },
    /* status invalidate */error => {
      removePendingRequest(error.config || {})

      // normal error handler
      if (axios.isCancel(error)) {
        // the request is cancelled
        // BE CAREFUL about this, because this Cancel error will be emit unexpectedly
        // do not popup the swal or dialogs here!
        console.log('??????????????????')
      } else if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx

        // it is unauthorized
        if (error.response.status === 401) {
          console.log('401????????????')
          abortPendingRequestAll() // by invoke this, other request will emit a error of Cancel, as above
          swal.toast.error.fire({
            title: '????????????',
            html: '??????????????????',
            didOpen: (toastDom) => {
              toastDom.addEventListener('click', swal.toast.error.clickConfirm)
            }
          }).then(() => {
            router.push({ name: 'Diversion' })
          })
        } else {
          swal.toast.error.fire({
            title: '??????????????????',
            html: `<details>
              <summary>????????????</summary>
              ${JSON.stringify(error.response.data)}
              </details>`
          })
        }
      } else if (error.request) {
        // The request was made but no response was received
        swal.toast.error.fire({
          title: '???????????????????????????????????????',
          html: `??????????????????<details>
            <summary>??????????????????</summary>
            <ol><li>???????????????????????????</li><li>????????????</li><li>???????????????????????????????????????????????????</li></ol>
            </details><details><summary>????????????</summary>
            ${JSON.stringify(error.message)}<br>${JSON.stringify(error.request)}`
        })
      } else {
        // Something happened in setting up the request that triggered an Error
        swal.modal.error.fire({
          title: '????????????',
          html: `<details>
          <summary>????????????</summary>
          ${JSON.stringify(error.message)}</details>`
        })
      }
      return Promise.reject(error)
    }
  )

  const axiosOption = {
    headers: header.headers,
    baseURL: resolveProtocol(diversionUrl),
    url: subUrl,
    method,
    timeout: 10000,
    [method === 'POST' && 'data']: body,
    validateStatus (status) {
      return (status >= 200 && status < 300) || excludeStatus.includes(status)
    }
  }
  const resp = await picaAxiosInstance(axiosOption)
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
