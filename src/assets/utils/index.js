import { formatImgUrl } from './formatImgUrl'
import { viewLargeImage } from './viewLargeImage'
import { getCalendarTime } from './getCalendarTime'
import { getDate } from './getDate'
import { base64ToBlob } from './base64ToBlob'
import { showLoadingPica, hideLoadingPica } from './controlLoadingPica'

export default {
  install: (app) => {
    app.config.globalProperties.$utils = {
      formatImgUrl,
      viewLargeImage,
      getCalendarTime,
      getDate,
      showLoadingPica,
      hideLoadingPica,
      base64ToBlob
    }
  }
}
