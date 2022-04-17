const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  writeRuntimeFile: ({ file, content }) => ipcRenderer.invoke('write-runtime-file', { file, content }),
  readRuntimeFile: ({ file }) => ipcRenderer.invoke('read-runtime-file', { file }),
  existRuntimeFile: ({ file }) => ipcRenderer.invoke('exist-runtime-file', { file })
})
