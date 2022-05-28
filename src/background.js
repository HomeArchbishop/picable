'use strict'

import { app, protocol, BrowserWindow, Menu, shell } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import packageJSON from '../package.json'
import appDefaultConfig from './configs/app.config.json'
import fs from 'fs'
import path from 'path'
import { createFolder } from './electron/createFolder'
import { checkUpdate } from './electron/checkUpdate'
import { ipcMainStart } from './electron/ipcMain'
import { checkAnnouncement } from './electron/checkAnnouncement'
import { registerGlobalShortcut } from './electron/registerGlobalShortcut'

const isDevelopment = process.env.NODE_ENV !== 'production'

const appRuntimeDirPath = isDevelopment
  ? path.resolve(__dirname, '../src/runtime')
  : path.resolve(__dirname, './runtime')
const appRuntimeConfigFilePath = path.resolve(appRuntimeDirPath, 'configs/app.config.json')
const appRuntimeConfig = fs.existsSync(appRuntimeConfigFilePath) ? JSON.parse(fs.readFileSync(appRuntimeConfigFilePath).toString()) : {}
const appConfig = { ...appDefaultConfig, ...appRuntimeConfig }

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
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
    frame: false,
    titleBarStyle: 'hidden',
    titleBarOverlay: true,
    show: false,
    backgroundColor: '#f6f6f6',
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true,
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
    createProtocol('app')
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

const topMenu = Menu.buildFromTemplate([
  {
    label: app.name,
    submenu: [
      { label: '关于' + app.name, role: 'about' },
      { type: 'separator' },
      { label: '服务', role: 'services' },
      { type: 'separator' },
      { label: '隐藏' + app.name, role: 'hide' },
      { label: '隐藏其他', role: 'hideOthers' },
      { label: '全部显示', role: 'unhide' },
      { type: 'separator' },
      { label: '退出' + app.name, role: 'quit' },
      { type: 'separator' },
      {
        label: 'GitHub仓库',
        click: async () => {
          await shell.openExternal(packageJSON.repository.github)
        }
      },
      {
        label: '项目主页',
        click: async () => {
          await shell.openExternal(packageJSON.repository.github)
        }
      }
    ]
  },
  {
    label: '编辑',
    submenu: [
      { label: '撤销', role: 'undo' },
      { label: '恢复', role: 'redo' },
      { type: 'separator' },
      { label: '剪切', role: 'cut' },
      { label: '复制', role: 'copy' },
      { label: '粘贴', role: 'paste' },
      { type: 'separator' },
      { label: '开始听写', role: 'startSpeaking' }
    ]
  },
  {
    label: '视图',
    submenu: [
      { label: '重载页面', role: 'reload' },
      { label: '强制重载', role: 'forceReload' },
      { label: 'devTools', role: 'toggleDevTools' },
      { type: 'separator' },
      { label: '重置缩放', role: 'resetZoom' },
      { label: '视图放大', role: 'zoomIn' },
      { label: '视图缩小', role: 'zoomOut' },
      { type: 'separator' },
      { label: '全屏', role: 'togglefullscreen' }
    ]
  }
])

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

ipcMainStart(appRuntimeDirPath)

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
