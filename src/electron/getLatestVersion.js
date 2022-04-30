import axios from 'axios'
import packageJSON from '../../package.json'

export async function getLatestVersion () {
  const res = await axios(packageJSON.notice.version + '?__hs__=' + new Date().getTime())
  console.log(res.data.latest)
  return res.data.latest
}
