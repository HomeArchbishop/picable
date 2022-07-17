import fs from 'fs-extra'
import path from 'path'

import * as hooks from './downloadHook'

export default async function deleteDownloadComic ({ comicId, episodesOrder }) {
  // has the pending download task, abort the download function
  if (await hooks.hasPendingDownload({ comicId, episodesOrder })) {
    await hooks.abortPendingDownload({ comicId, episodesOrder })
  }
  // delete all the files and dir about the episode
  const epiDirPath = path.resolve(
    global.RUNTIME_DATA_PATH, 'database/download', comicId, episodesOrder
  )
  console.log(epiDirPath)
  fs.removeSync(epiDirPath)

  return 'delete_success'
}
