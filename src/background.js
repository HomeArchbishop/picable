'use strict'

import { app, protocol, BrowserWindow, Menu } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import path from 'path'
import { checkUpdate } from './electron/checkUpdate'
import { ipcMainStart } from './electron/ipcMain'
import { checkAnnouncement } from './electron/checkAnnouncement'
import { registerGlobalShortcut } from './electron/registerGlobalShortcut'
import resolveRuntimeDirStructure from './electron/resolveRuntimeDirStructure'
import resolveAppConfig from './electron/resolveAppConfig'
import updateAppConfig from './electron/updateAppConfig'
import topMenuTemplate from './electron/menuTemplate/topMenuTemplate'
import sweepDownloadingPast from './electron/downloadComic/sweepDownloadingPast'
import * as windowsManager from './electron/windowsManager'
import { startDownloadStateWatcher } from './electron/downloadComic/downloadStateWatcher'

const isDevelopment = process.env.NODE_ENV !== 'production'

// set the runtime dir to global
// NOTICE
// if you want to change the dirname 'runtime', just modify the name below,
// all the runtime-dir-path depends on this
global.RUNTIME_DATA_PATH = path.resolve(app.getPath('userData'), 'runtime')

// resolve the runtime dir,
// ensure that the `runtime` dir has main structure
resolveRuntimeDirStructure()

// resolve the config object for app
const appConfig = resolveAppConfig()

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'picable', privileges: { secure: true, standard: true } }
])

async function createWindow () {
  // Create the browser window.
  const win = new BrowserWindow({
    width: appConfig.window.width,
    height: appConfig.window.height,
    minWidth: 800,
    minHeight: 600,
    x: appConfig.window.x,
    y: appConfig.window.y,
    // frame: false,
    titleBarStyle: 'hiddenInset',
    // titleBarOverlay: true,
    show: false,
    backgroundColor: '#f6f6f6',
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      preload: path.resolve(__dirname, './preload.js')
    }
  })

  win.once('ready-to-show', () => {
    win.show()
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL, { userAgent: 'okhttp/3.8.1' })
    if (!process.env.IS_TEST) win.webContents.openDevTools(/* { mode: 'detach' } */)
  } else {
    createProtocol('picable')
    win.loadURL('picable://./index.html', { userAgent: 'okhttp/3.8.1' })
  }

  win.on('resized', e => {
    const sizeData = win.getContentBounds()
    appConfig.window = sizeData
    updateAppConfig(appConfig)
  })

  win.on('moved', e => {
    const sizeData = win.getContentBounds()
    appConfig.window = sizeData
    updateAppConfig(appConfig)
  })

  await windowsManager.registerWindow(win.id, win.webContents)

  win.on('close', e => {
    windowsManager.removeWindow(win.id)
  })

  return win
}

const dockMenu = Menu.buildFromTemplate([
  {
    label: '新窗口',
    click () {
      createWindow()
    }
  }
])

const topMenu = Menu.buildFromTemplate(topMenuTemplate)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

app.on('ready', async () => {
  if (process.platform === 'darwin') {
    Menu.setApplicationMenu(topMenu)
    app.dock.setMenu(dockMenu)
  }
  registerGlobalShortcut(app)
  createWindow().then(win => {
    checkUpdate()
    checkAnnouncement()
  })
})

sweepDownloadingPast()
startDownloadStateWatcher()

ipcMainStart()

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
