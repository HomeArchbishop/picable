import { ipcMain, shell } from 'electron'
import fs from 'fs-extra'
import path from 'path'

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

  ipcMain.handle('open-browser', async (event, { url }) => {
    shell.openExternal(url)
  })
}
