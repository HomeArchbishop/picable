import fs from 'fs-extra'
import path from 'path'

export default function updateAppConfig (nextConfigJSON) {
  const appRuntimeConfigFilePath = path.resolve(global.RUNTIME_DATA_PATH, 'configs/app.config.json')
  fs.outputJSONSync(appRuntimeConfigFilePath, nextConfigJSON)
}
