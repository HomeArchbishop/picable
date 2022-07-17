import fs from 'fs-extra'
import path from 'path'

export default function sweepDownloadingPast () {
  const downloadDirPath = path.resolve(
    global.RUNTIME_DATA_PATH, 'database/download'
  )
  if (!fs.existsSync(downloadDirPath)) { return }

  const comicIdList = (fs.readdirSync(downloadDirPath)).filter(s => !s.startsWith('.'))
  for (const comicId of comicIdList) {
    const epiOrderListOrigin = (fs.readdirSync(path.resolve(downloadDirPath, comicId))).filter(s => !s.startsWith('.'))
    const epiOrderList = []
    for (const epiOrder of epiOrderListOrigin) {
      if (fs.existsSync(path.resolve(downloadDirPath, comicId, epiOrder, 'epi.json'))) {
        epiOrderList.push(epiOrder)
        const epiStateFileJSON = fs.readJSONSync(path.resolve(downloadDirPath, comicId, epiOrder, 'epi.json'))
        if (epiStateFileJSON.state !== 'success') {
          epiStateFileJSON.state = 'error'
        }
        for (const fileKey in epiStateFileJSON.refer) {
          if (epiStateFileJSON.refer[fileKey].state !== 'success') {
            epiStateFileJSON.refer[fileKey].state = 'failed'
          }
        }
        fs.outputJSONSync(path.resolve(downloadDirPath, comicId, epiOrder, 'epi.json'), epiStateFileJSON)
      }
    }
    if (!epiOrderList.length) {
      // the comic has no real download task
      fs.removeSync(path.resolve(downloadDirPath, comicId))
    }
  }
}
