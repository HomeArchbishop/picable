import { ipcMain, shell } from 'electron'
import fs from 'fs-extra'
import path from 'path'
import deleteDownloadComic from './downloadComic/deleteDownloadComic'
import downloadComic from './downloadComic/downloadComic'
import packPDF from './downloadComic/packPDF'
import packZIP from './downloadComic/packZIP'

export function ipcMainStart () {
  const appRuntimeDirPath = global.RUNTIME_DATA_PATH

  ipcMain.handle('write-runtime-file', async (event, { file, content }) => {
    const fileResolvedPath = path.resolve(appRuntimeDirPath, './database', file)
    fs.outputFileSync(fileResolvedPath, content)
  })

  ipcMain.handle('read-runtime-file', async (event, { file }) => {
    const fileResolvedPath = path.resolve(appRuntimeDirPath, './database', file)
    const content = fs.readFileSync(fileResolvedPath)
    return content.toString()
  })

  ipcMain.handle('exist-runtime-file', async (event, { file }) => {
    const fileResolvedPath = path.resolve(appRuntimeDirPath, './database', file)
    return fs.existsSync(fileResolvedPath)
  })

  ipcMain.handle('read-runtime-dir', async (event, { dir }) => {
    const dirResolvedPath = path.resolve(appRuntimeDirPath, './database', dir)
    return fs.readdirSync(dirResolvedPath)
  })

  ipcMain.handle('exist-runtime-dir', async (event, { dir }) => {
    const dirResolvedPath = path.resolve(appRuntimeDirPath, './database', dir)
    return fs.existsSync(dirResolvedPath)
  })

  ipcMain.handle('open-browser', async (event, { url }) => {
    shell.openExternal(url)
  })

  ipcMain.handle('download-comic', async function downloadComicHandler (event, { comicDownloadInfo }) {
    await downloadComic({ comicDownloadInfo })
  })

  ipcMain.handle('delete-download-comic', async function downloadComicHandler (event, { comicId, episodesOrder }) {
    return await deleteDownloadComic({ comicId, episodesOrder })
  })

  ipcMain.handle('pack-pdf', async function (event, { comicId, episodesOrder }) {
    return await packPDF({ comicId, episodesOrder })
  })

  ipcMain.handle('pack-zip', async function (event, { comicId, episodesOrder }) {
    return await packZIP({ comicId, episodesOrder })
  })
}
