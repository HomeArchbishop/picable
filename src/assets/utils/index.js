import { formatImgUrl } from './formatImgUrl'
import { viewLargeImage } from './viewLargeImage'
import { getCalendarTime } from './getCalendarTime'
import { getDate } from './getDate'

export default {
  install: (app) => {
    app.config.globalProperties.$utils = {
      formatImgUrl,
      viewLargeImage,
      getCalendarTime,
      getDate
    }
  }
}
