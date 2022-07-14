import axios from 'axios'
import fs from 'fs-extra'
import path from 'path'

import * as hooks from './downloadHook'

// My download logic: (I choose VERSION_2)
// [VERSION_1]
// - All the pictures is queued to download, one by one.
// - If one picture's download fails, the whole episode's download fails.
// [VERSION_2]
// - Record which pictures that are failed.
// - Retry these when user needs.
// - Those half-failed books is not readable for the frontend PictureViewer.
export default async function downloadComic ({ comicDownloadInfo }) {
  comicDownloadInfo = JSON.parse(comicDownloadInfo)
  const { comicDetail, pictureInfoList } = comicDownloadInfo

  const epiDirPath = path.resolve(
    global.RUNTIME_DATA_PATH, 'database/download', comicDetail._id, comicDetail.episodesOrder
  )
  fs.ensureDirSync(epiDirPath)
  fs.emptyDirSync(epiDirPath)

  // download each picture
  const pictureDirPath = path.resolve(epiDirPath, 'pictures')
  fs.ensureDirSync(pictureDirPath)

  // hooks
  await hooks.initEpiStateFile({
    epiDirPath,
    comicDetail,
    pictureInfoList
  })

  const taskStack = Array.from({ length: pictureInfoList.length })

  for (const pictureIndex in pictureInfoList) {
    const pictureInfo = pictureInfoList[pictureIndex]
    const pictureURL = new URL(pictureInfo.media.path, 'https://storage1.picacomic.com/static/').href
    const pictureName = path.basename(pictureURL)
    // `${comicDetail.title}-${comicDetail.author}-${comicDetail.chineseTeam}-${pictureIndex}${path.extname(pictureURL)}`
    const pictureFilePath = path.resolve(pictureDirPath, pictureName)

    try {
      console.log('start_download', pictureIndex, pictureURL)
      // hooks
      await hooks.updatePictureState({ epiDirPath, pictureName, state: 'downloading' })
      // request
      const resp = await axios.request({
        url: pictureURL,
        timeout: 15000,
        maxRedirects: 10,
        responseType: 'stream'
      })
      const dataStream = resp.data
      const writeStream = fs.createWriteStream(pictureFilePath)
      dataStream.pipe(writeStream)
      // stream error
      writeStream.on('error', () => { throw new Error('__stream_error') })
      // success
      let successHookResolve
      const successHookPromise = new Promise((resolve) => {
        successHookResolve = resolve
      })
      successHookPromise.catch(() => null)
      writeStream.on('finish', () => {
        console.log('succe_download', pictureIndex, pictureURL)
        // hooks
        hooks.updatePictureState({ epiDirPath, pictureName, state: 'success' })
          .then(successHookResolve())
        // push the stack
        taskStack[pictureIndex] = Promise.resolve()
      })
      await successHookPromise
    } catch (err) {
      console.log('error_download', pictureIndex, pictureURL)
      // hooks
      await hooks.updatePictureState({ epiDirPath, pictureName, state: 'failed' })

      // push the stack
      const error = new Error('download network failed')
      error.comic = { pictureName }
      const rej = Promise.reject(error)
      rej.catch(() => null)
      taskStack[pictureIndex] = rej
    }
  }

  // finish the whole process
  Promise.allSettled(taskStack)
    .then((results) => {
      // sort out from results
      const successResults = []
      const failedResults = []
      for (const result of results) {
        if (result.status === 'fulfilled') {
          successResults.push(result)
        } else {
          failedResults.push(result)
        }
      }

      // all pictures are well downloaded
      if (successResults.length === results.length) {
        console.log('all done sucessfully', successResults.length)
        hooks.updateEpiState({ epiDirPath, state: 'success' })
        return
      }

      // some pictures failed to download
      hooks.updateEpiState({ epiDirPath, state: 'error' })
    })
    .catch(() => null)
}
