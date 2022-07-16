import { contextBridge, ipcRenderer } from 'electron'
import packageJSON from '../package.json'
import { getLatestVersion } from './electron/getLatestVersion'

window.sessionStorage.setItem('__PICABLE__IS_NEED_UPDATE__', false)

getLatestVersion().then(version => {
  const LatestVersion = version.split('.')
  const currentVersion = packageJSON.version.split('.')
  for (let i = 0; i < Math.max(LatestVersion.length, currentVersion.length); i++) {
    if ((+LatestVersion[i] || 0) > (+currentVersion[i] || 0)) {
      window.sessionStorage.setItem('__PICABLE__IS_NEED_UPDATE__', true)
      break
    }
  }
})

contextBridge.exposeInMainWorld('electronAPI', {
  writeRuntimeFile: ({ file, content }) => ipcRenderer.invoke('write-runtime-file', { file, content }),
  readRuntimeFile: ({ file }) => ipcRenderer.invoke('read-runtime-file', { file }),
  existRuntimeFile: ({ file }) => ipcRenderer.invoke('exist-runtime-file', { file }),
  readRuntimeDir: ({ dir }) => ipcRenderer.invoke('read-runtime-dir', { dir }),
  existRuntimeDir: ({ dir }) => ipcRenderer.invoke('exist-runtime-dir', { dir }),
  openBrowser: ({ url }) => ipcRenderer.invoke('open-browser', { url }),
  downloadComic: ({ comicDownloadInfo }) => {
    return ipcRenderer.invoke('download-comic', { comicDownloadInfo })
  },
  packPDF: ({ comicId, episodesOrder }) => ipcRenderer.invoke('pack-pdf', { comicId, episodesOrder }),
  packZIP: ({ comicId, episodesOrder }) => ipcRenderer.invoke('pack-zip', { comicId, episodesOrder })
})
