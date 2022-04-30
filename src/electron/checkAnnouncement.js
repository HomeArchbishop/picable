import packageJSON from '../../package.json'
import axios from 'axios'
import { BrowserWindow } from 'electron'

function createTipWindow () {
  const win = new BrowserWindow({ width: 430, height: 550, x: 890, y: 200 })
  // Load a remote URL
  win.loadURL(packageJSON.notice.announ + '/?__hs__=' + new Date().getTime())
}

export async function checkAnnouncement () {
  axios(packageJSON.notice['announ:state'] + '?__hs__=' + new Date().getTime())
    .catch(() => {
      setTimeout(checkAnnouncement, 70000)
    })
    .then(res => {
      console.log(res.data)
      if (res.data.show) {
        createTipWindow()
      }
    })
}
