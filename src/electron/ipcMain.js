import { ipcMain, shell } from 'electron'
import fs from 'fs'
import path from 'path'
import { createFolder } from './createFolder'

export function ipcMainStart (appRuntimeDirPath) {
  ipcMain.handle('write-runtime-file', async (event, { file, content }) => {
    const fileResolvedPath = path.resolve(appRuntimeDirPath, './database', file)
    createFolder(fileResolvedPath)
    fs.writeFileSync(fileResolvedPath, content)
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
