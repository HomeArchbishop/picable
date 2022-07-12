import fs from 'fs-extra'
import path from 'path'
import appDefaultConfig from '../configs/app.config.json'

export default function resolveAppConfig () {
  const appRuntimeConfigFilePath = path.resolve(global.RUNTIME_DATA_PATH, 'configs/app.config.json')
  if (!fs.existsSync(appRuntimeConfigFilePath)) {
    fs.outputJSONSync(appRuntimeConfigFilePath, {})
  }
  const appRuntimeConfig = fs.readJSONSync(appRuntimeConfigFilePath)
  const appConfig = { ...appDefaultConfig, ...appRuntimeConfig }
  return appConfig
}
