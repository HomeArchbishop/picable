import path from 'path'
import fs from '../utils/fs-extra-safe'

export default async function initProxy (webContents) {
  const proxyFilePath = path.resolve(
    global.RUNTIME_DATA_PATH, 'database/proxy.json'
  )
  const proxyArgs = fs.existsSync(proxyFilePath)
    ? fs.readJSONSync(proxyFilePath)
    : { isUseProxy: false, proxyURL: '', isLocalNeedProxy: false, isSystemFirst: true }

  const proxyConfig = {
    proxyRules: proxyArgs.proxyURL,
    proxyBypassRules: proxyArgs.isLocalNeedProxy
      ? undefined : '.local,<local>,192.168.0.0/16,10.0.0.0/8,172.16.0.0/12,127.0.0.0/8,100.64.0.0/10'
    // TODO isSystemFirst not supported
    // mode: proxyArgs.isSystemFirst ? 'system' : undefined
  }

  if (proxyArgs.isUseProxy) {
    console.log('open proxy')
    await webContents.session.setProxy(proxyConfig)
  } else {
    console.log('no proxy')
    await webContents.session.setProxy({ mode: 'system' })
  }
}
