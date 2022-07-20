import * as windowsManager from '../windowsManager'
import fs from '../utils/fs-extra-safe'
import path from 'path'

async function setProxy ({ isUseProxy = true, proxyURL = '', isLocalNeedProxy = false, isSystemFirst = true }) {
  isUseProxy = !!(isUseProxy && proxyURL)

  if (!isUseProxy) {
    const webContentsList = windowsManager.getWebContentsAll()
    for (const webContents of webContentsList) {
      await webContents.session.setProxy({ mode: 'system' })
    }
  } else {
    const nextProxyConfig = {
      proxyRules: proxyURL,
      proxyBypassRules: isLocalNeedProxy
        ? undefined : '.local,<local>,192.168.0.0/16,10.0.0.0/8,172.16.0.0/12,127.0.0.0/8,100.64.0.0/10',
      mode: isSystemFirst ? 'system' : undefined
    }

    const webContentsList = windowsManager.getWebContentsAll()
    for (const webContents of webContentsList) {
      await webContents.session.setProxy(nextProxyConfig)
    }
  }

  const proxyFilePath = path.resolve(
    global.RUNTIME_DATA_PATH, 'database/proxy.json'
  )
  const nextStoreProxyArgs = { isUseProxy, proxyURL, isLocalNeedProxy, isSystemFirst }
  fs.outputJSONSync(proxyFilePath, nextStoreProxyArgs)

  return 'set_success'
}

export {
  setProxy
}
