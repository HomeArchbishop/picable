import { dialog } from 'electron'
import fs from '../utils/fs-extra-safe'
import path from 'path'
import JSZip from 'jszip'

// DO NOT change the name 'epi.json'
function getEpiStateFilePath (epiDirPath) {
  return path.resolve(epiDirPath, './epi.json')
}

async function resolveExtname (originPath, extWithoutDot) {
  if (!originPath.endsWith('.' + extWithoutDot)) {
    return originPath + '.' + extWithoutDot
  }
  return originPath
}

export default async function packZIP ({ comicId, episodesOrder }) {
  try {
    const epiDirPath = path.resolve(
      global.RUNTIME_DATA_PATH, 'database/download', comicId, episodesOrder
    )
    const epiStateFilePath = getEpiStateFilePath(epiDirPath)

    // file 'epi.json' does not exist
    // WHAT TO DO: return
    // // WHAT TO DO: donwload an empty pdf
    if (!fs.existsSync(epiStateFilePath)) {
      return 'save_error'
    }

    const epiStateFileJSON = fs.readJSONSync(epiStateFilePath)
    const referItemList = Object.values(epiStateFileJSON.refer).sort((a, b) => +a.order - +b.order)
    const zip = new JSZip()
    // pack each page
    for (const pictureReferItem of referItemList) {
      const { fileName, name } = pictureReferItem
      const pictureFilePath = path.resolve(epiDirPath, 'pictures', fileName)
      const imageArrayBuffer = fs.readFileSync(pictureFilePath).buffer
      zip.file(name, imageArrayBuffer)
    }
    // save the zip file
    const zipStream = zip.generateNodeStream({ type: 'nodebuffer' })
    const saveZIPName = epiStateFileJSON.info.comicDetail.title + '-' +
      epiStateFileJSON.info.comicDetail.episodesOrder + '-' +
      epiStateFileJSON.info.comicDetail.author + '-' +
      epiStateFileJSON.info.comicDetail.chineseTeam + '.zip'
    const savePath = dialog.showSaveDialogSync({ defaultPath: saveZIPName })
    if (typeof savePath === 'undefined') { return 'save_cancelled' }
    const writeStream = fs.createWriteStream(await resolveExtname(savePath, 'zip')) // 'binary'
    let resolveFunc
    const waitFlag = new Promise((resolve) => { resolveFunc = resolve })
    zipStream.pipe(writeStream).on('finish', () => resolveFunc())
    await waitFlag
    return 'save_success'
  } catch (err) {
    console.log(err, 'pack ZIP has error')
    return 'save_error'
  }
}
