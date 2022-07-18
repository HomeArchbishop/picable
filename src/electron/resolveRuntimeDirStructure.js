import fs from './utils/fs-extra-safe'
import path from 'path'

export default function resolveRuntimeDirStructure () {
  // => picable/runtime
  fs.ensureDirSync(global.RUNTIME_DATA_PATH)

  // => picable/runtime/config
  const appRuntimeConfigDirPath = path.resolve(global.RUNTIME_DATA_PATH, 'configs')
  fs.ensureDirSync(appRuntimeConfigDirPath)

  // => picable/runtime/database
  const appRuntimeDataBaseDirPath = path.resolve(global.RUNTIME_DATA_PATH, 'database')
  fs.ensureDirSync(appRuntimeDataBaseDirPath)

  // => picable/runtime/database/download
  const appRuntimeDataBaseDownloadDirPath = path.resolve(global.RUNTIME_DATA_PATH, 'database/download')
  fs.ensureDirSync(appRuntimeDataBaseDownloadDirPath)
}
