import fs from 'fs-extra'
import path from 'path'
// Agreements:
// There is only one state file for each epi,
// it contains every info:
// comic, epi, pictures order, download state, etc.

function getEpiStateFilePath (epiDirPath) {
  return path.resolve(epiDirPath, './epi.json')
}

async function initEpiStateFile ({
  epiDirPath,
  comicDetail, pictureInfoList
}) {
  const initEpiStateFileStructure = {
    // A string that describe the state of this epi
    // value: 'downloading' | 'cancelled' | 'error' | 'success'
    // - 'downloading' the epi is downloading
    // - 'cancelled' the epi is cancelled by user (sometimes the app is closed)
    // - 'error' the epi download finished, but some of the pictures failed
    // - 'success' the epi is well downloaded
    state: 'downloading',
    // the info of the comic and the epi,
    // normally, this should not be modified
    info: {
      comicDetail, // Object. See views/ComicDetail.vue -> func `getComicAllDownloadInfo`
      pictureInfoList // PictureInfoObject[]
    },
    // a reference for each picture's info
    refer: {
      // (this item is a sample, it will be overwriten soon)
      // normally, only the `xxx.state` can be modified
      'xxxxxxxxabc.jpg': {
        fileName: 'xxxxxxxxabc.jpg',
        url: 'https://.../xxxxxxxxabc.jpg',
        // name is a better title for human to read
        name: '{title}-{author}-{chineseTeam}-{pictureOrder}.jpg',
        // order starts from 1 instead of 0
        order: 1,
        // state of the picture,
        // will be used while the epi download state is NOT 'cancelled',
        // value: 'waiting' | 'downloading' | 'failed' | 'success'
        // 'waiting' this is a init value, means the pic is waiting
        // 'downloading' the pic is downloading
        // 'failed' the pic has something wrong
        // 'success' the pic is well downloaded
        state: 'waiting'
      }
    }
  }

  initEpiStateFileStructure.refer = {}
  for (const _pictureIndex in pictureInfoList) {
    const pictureIndex = +_pictureIndex
    const pictureInfo = pictureInfoList[pictureIndex]
    const fileName = path.basename(pictureInfo.media.path)
    const extName = path.extname(fileName)
    const pictureOrder = 1 + pictureIndex
    initEpiStateFileStructure.refer[fileName] = {
      fileName,
      url: new URL(pictureInfo.media.path, 'https://storage1.picacomic.com/static/').href,
      name: `${comicDetail.title}-${comicDetail.author}-${comicDetail.chineseTeam}-${pictureOrder}${extName}`,
      order: pictureOrder,
      state: 'waiting'
    }
  }

  fs.outputJSONSync(getEpiStateFilePath(epiDirPath), initEpiStateFileStructure)
}

/**
 * update an epi's download state
 * @param {{
 *  state: 'downloading' | 'cancelled' | 'error' | 'success'
 * }}
 */
async function updateEpiState ({ state, epiDirPath }) {
  const epiStateStructure = fs.readJSONSync(getEpiStateFilePath(epiDirPath))
  epiStateStructure.state = state
  fs.outputJSONSync(getEpiStateFilePath(epiDirPath), epiStateStructure)
}

/**
 * update a picture's download state
 * @param {{
 *  pictureName: String,
 *  state: 'waiting' | 'downloading' | 'failed' | 'success'
 * }}
 */
async function updatePictureState ({ pictureName, state, epiDirPath }) {
  const epiStateStructure = fs.readJSONSync(getEpiStateFilePath(epiDirPath))
  epiStateStructure.refer[pictureName].state = state
  fs.outputJSONSync(getEpiStateFilePath(epiDirPath), epiStateStructure)
}

export {
  initEpiStateFile, updateEpiState, updatePictureState
}
