import { sendGet } from './request'

// 返回某一本漫画详细信息
async function info ({ diversionUrl, token, comicId }) {
  const subUrl = `comics/${comicId}`
  const respData = await sendGet({
    diversionUrl, subUrl, token
  })
  return respData.data.comic
}

// 返回漫画本体（某一话的某一分页面所有图片）
async function picture ({ diversionUrl, token, comicId, epsOrder, page = 1 }) {
  const subUrl = `comics/${comicId}/order/${epsOrder}/pages?page=${page}`
  const respData = await sendGet({
    diversionUrl, subUrl, token
  })
  return respData.data
}

export {
  info, picture
}
