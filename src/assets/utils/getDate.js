import * as dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'

dayjs.locale('zh-cn')

export const getDate = function (isoTimeStr) {
  return dayjs(isoTimeStr).format('YYYY/MM/DD')
}
