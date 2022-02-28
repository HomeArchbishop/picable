import * as dayjs from 'dayjs'
import calendar from 'dayjs/plugin/calendar'
import 'dayjs/locale/zh-cn'

dayjs.extend(calendar)
dayjs.locale('zh-cn')

export const getCalendarTime = function (isoTimeStr) {
  return dayjs(isoTimeStr).calendar(null, {
    sameDay: '[今天] A h:mm', // The same day ( Today at 2:30 AM )
    nextDay: '[哔咔说是明天，可能是时区问题]', // The next day ( Tomorrow at 2:30 AM )
    nextWeek: '[哔咔说是下周]ddah:mm[，可能是时区问题]', // The next week ( Sunday at 2:30 AM )
    lastDay: '[昨天] A h:mm', // The day before ( Yesterday at 2:30 AM )
    lastWeek: '[周]dd A h:mm', // Last week ( Last Monday at 2:30 AM )
    sameElse: 'YYYY/MM/DD A h:mm' // Everything else ( 7/10/2011 )
  })
}
