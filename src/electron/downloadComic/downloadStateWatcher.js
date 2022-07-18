import * as windowsManager from '../windowsManager'
import watch from 'node-watch'
import fs from '../utils/fs-extra-safe'
import path from 'path'

function generateDownloadStateWatcher () {
  const downloadDirPath = path.resolve(
    global.RUNTIME_DATA_PATH, 'database/download'
  )
  fs.ensureDirSync(downloadDirPath)

  return watch(
    downloadDirPath,
    {
      recursive: true,
      filter: /epi.json$/
    },
    (evt, name) => {
      // send message to all of ipcRenderer
      const webContentsList = windowsManager.getWebContentsAll()
      webContentsList.forEach(webContents => webContents.send('download-state-change', ''))
    }
  )
}

function startDownloadStateWatcher () {
  generateDownloadStateWatcher()
}

export {
  startDownloadStateWatcher
}
