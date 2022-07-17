const windowsMap = new Map()

const registerWindow = async function (winID, webContents) {
  windowsMap.set(winID, webContents)
}

const removeWindow = async function (winID) {
  windowsMap.delete(winID)
}

const getWebContentsAll = function () {
  return [...windowsMap.values()]
}

export {
  registerWindow, removeWindow, getWebContentsAll
}
