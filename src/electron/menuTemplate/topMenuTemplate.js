import { app, shell } from 'electron'
import packageJSON from '../../../package.json'

export default [
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
]
