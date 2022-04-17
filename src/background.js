'use strict'

import { app, protocol, BrowserWindow, ipcMain } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import appDefaultConfig from './configs/app.config.json'
import fs from 'fs'
import path from 'path'

const isDevelopment = process.env.NODE_ENV !== 'production'

const appRuntimeDirPath = isDevelopment
  ? path.resolve(__dirname, '../src/runtime')
  : path.resolve(__dirname, './runtime')
const appRuntimeConfigFilePath = path.resolve(appRuntimeDirPath, 'configs/app.config.json')
const appRuntimeConfig = fs.existsSync(appRuntimeConfigFilePath) ? JSON.parse(fs.readFileSync(appRuntimeConfigFilePath).toString()) : {}
const appConfig = { ...appDefaultConfig, ...appRuntimeConfig }

function createFolder (to) {
  const sep = path.sep
  const folders = path.dirname(to).split(sep).reverse()
  let p = ''
  while (folders.length) {
    p += folders.pop() + sep
    if (!fs.existsSync(p)) {
      fs.mkdirSync(p)
    }
  }
}

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

if (process.platform === 'darwin') {
  // app.dock.setIcon(path.join(__dirname, '../static/favicons/favicon.icns'))
}

async function createWindow () {
  // Create the browser window.
  const win = new BrowserWindow({
    // icon: path.join(__dirname, '../static/favicons/favicon.icns'),
    width: appConfig.window.width,
    height: appConfig.window.height,
    minWidth: 800,
    minHeight: 600,
    x: appConfig.window.x,
    y: appConfig.window.y,
    frame: false,
    titleBarStyle: 'hiddenInset',
    show: false,
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true,
      preload: path.resolve(__dirname, 'preload.js')

      // Required for Spectron testing
      // enableRemoteModule: !!process.env.IS_TEST

      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      // nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      // contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION
    }
  })

  win.once('ready-to-show', () => {
    win.show()
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL, { userAgent: 'okhttp/3.8.1' })
    if (!process.env.IS_TEST) win.webContents.openDevTools(/* { mode: 'detach' } */)
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html', { userAgent: 'okhttp/3.8.1' })
  }

  win.on('resized', e => {
    const sizeData = win.getContentBounds()
    appConfig.window = sizeData
    createFolder(appRuntimeConfigFilePath)
    fs.writeFileSync(appRuntimeConfigFilePath, JSON.stringify(appConfig))
  })

  win.on('moved', e => {
    const sizeData = win.getContentBounds()
    appConfig.window = sizeData
    createFolder(appRuntimeConfigFilePath)
    fs.writeFileSync(appRuntimeConfigFilePath, JSON.stringify(appConfig))
  })

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
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  createWindow()
})

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
