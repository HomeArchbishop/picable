import { formatImgUrl } from './formatImgUrl'
import { viewLargeImage } from './viewLargeImage'
import { getCalendarTime } from './getCalendarTime'
import { getDate } from './getDate'
import { showLoadingPica, hideLoadingPica } from './controlLoadingPica'
import { getImgReverseColor } from './getImgReverseColor'

export default {
  install: (app) => {
    app.config.globalProperties.$utils = {
      formatImgUrl,
      viewLargeImage,
      getCalendarTime,
      getDate,
      showLoadingPica,
      hideLoadingPica,
      getImgReverseColor
    }
  }
}
