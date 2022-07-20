import packageJSON from '../../package.json'
import { getLatestVersion } from './getLatestVersion'
import { BrowserWindow } from 'electron'

function createTipWindow (v) {
  const win = new BrowserWindow({ width: 430, height: 550, x: 450, y: 200 })
  // Load a remote URL
  win.loadURL(packageJSON.notice.update + '/?__hs__=' + v)
}

export async function checkUpdate () {
  getLatestVersion()
    .catch(() => {
      setTimeout(checkUpdate, 50000)
    })
    .then((version = '0.0.0') => {
      const LatestVersion = version.split('-')[0].split('.')
      const currentVersion = packageJSON.version.split('-')[0].split('.')
      console.log(LatestVersion, currentVersion)
      for (let i = 0; i < Math.max(LatestVersion.length, currentVersion.length); i++) {
        if ((+LatestVersion[i] || 0) === (+currentVersion[i] || 0)) {
          continue
        }
        if ((+LatestVersion[i] || 0) > (+currentVersion[i] || 0)) {
          createTipWindow(version)
        }
        break
      }
    })
}
