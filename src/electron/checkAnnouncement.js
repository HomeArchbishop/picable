import axios from 'axios'
import { BrowserWindow } from 'electron'

function createTipWindow () {
  const win = new BrowserWindow({ width: 430, height: 550, x: 890, y: 200 })
  // Load a remote URL
  win.loadURL('https://homearchbishop.github.io/picable-notice/announcement/')
}

export async function checkAnnouncement () {
  axios('https://homearchbishop.github.io/picable-notice/announcement/state.json')
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
