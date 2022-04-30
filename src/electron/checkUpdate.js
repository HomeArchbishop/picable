import axios from 'axios'
import packageJSON from '../../package.json'
import { BrowserWindow } from 'electron'

function createTipWindow () {
  const win = new BrowserWindow({ width: 430, height: 550, x: 450, y: 200 })
  // Load a remote URL
  win.loadURL('https://homearchbishop.github.io/picable-notice/')
}

export async function checkUpdate () {
  axios('https://homearchbishop.github.io/picable-notice/version/latest.json')
    .catch(() => {
      setTimeout(checkUpdate, 50000)
    })
    .then(res => {
      console.log(res.data)
      const LatestVersion = res.data.latest.split('.')
      const currentVersion = packageJSON.version.split('.')
      for (let i = 0; i < Math.max(LatestVersion.length, currentVersion.length); i++) {
        if ((+LatestVersion[i] || 0) > (+currentVersion[i] || 0)) {
          createTipWindow()
          break
        }
      }
    })
}
