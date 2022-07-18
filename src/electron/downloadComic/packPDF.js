import { dialog } from 'electron'
import fs from '../utils/fs-extra-safe'
import path from 'path'
import { PDFDocument, rgb } from 'pdf-lib'

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

async function isJPEG (int8Array) {
  const magicNumber = '255216255224' // ['ff', 'd8', 'ff', 'e0'].join('')
  const data = int8Array.slice(0, 4).join('')
  return data === magicNumber
}

async function isPNG (int8Array) {
  const magicNumber = '137807871' // ['89', '50', '4e', '47'].join('')
  const data = int8Array.slice(0, 4).join('')
  return data === magicNumber
}

// async function createEmptyPDFBytes () {
//   const pdfDoc = await PDFDocument.create()
//   const page = pdfDoc.addPage()
//   const { height } = page.getSize()
//   page.drawText(
//     'Error!!\n\n' +
//     'Please delete the comic episode and download it again in Picable.\n' +
//     'Moreover, notice that do not modify the local download storage of Picable.',
//     {
//       x: 50,
//       y: height - 4 * 30,
//       size: 10,
//       color: rgb(214 / 225, 110 / 225, 158 / 225) // #d66e9e
//     }
//   )
//   const pdfBytes = await pdfDoc.save()
//   return pdfBytes
// }

export default async function packPDF ({ comicId, episodesOrder }) {
  try {
    const epiDirPath = path.resolve(
      global.RUNTIME_DATA_PATH, 'database/download', comicId, episodesOrder
    )
    const epiStateFilePath = getEpiStateFilePath(epiDirPath)

    // file 'epi.json' does not exist
    // WHAT TO DO: donwload an empty pdf
    if (!fs.existsSync(epiStateFilePath)) {
      return 'save_error'
      // const pdfEmptyBytes = await createEmptyPDFBytes()
      // const dataBuf = Buffer.from(pdfEmptyBytes)
      // const savePDFName = comicId + '-' + episodesOrder + '.pdf'
      // const savePath = dialog.showSaveDialogSync({ defaultPath: savePDFName })
      // if (typeof savePath === 'undefined') { return 'save_cancelled' }
      // fs.writeFileSync(await resolveExtname(savePath, 'pdf'), dataBuf, 'binary')
      // return 'save_success'
    }

    const epiStateFileJSON = fs.readJSONSync(epiStateFilePath)
    const pdfDoc = await PDFDocument.create()
    const referItemList = Object.values(epiStateFileJSON.refer).sort((a, b) => +a.order - +b.order)
    // draw each page
    const fixedPageWidth = 500
    for (const pictureReferItem of referItemList) {
      const { fileName } = pictureReferItem
      const pictureFilePath = path.resolve(epiDirPath, 'pictures', fileName)
      const imageBytes = new Uint8Array(fs.readFileSync(pictureFilePath).buffer)
      if (!await isPNG(imageBytes) && !await isJPEG(imageBytes)) {
        // the picture is neither jpeg nor png
        const page = pdfDoc.addPage([fixedPageWidth, 130])
        page.drawText(
          'Sorry!\n' +
          'This picture is neither jpeg nor png,\n' +
          'It cannot be saved properly now.\n' +
          'It will be supported in the near future.',
          {
            x: 50,
            y: 100,
            size: 10,
            color: rgb(214 / 225, 110 / 225, 158 / 225) // #d66e9e
          }
        )
        continue
      }
      const pdfImage = await isPNG(imageBytes)
        ? await pdfDoc.embedPng(imageBytes) : await pdfDoc.embedJpg(imageBytes)
      const originWidth = pdfImage.scale(1).width
      const { width, height } = pdfImage.scale(fixedPageWidth / originWidth)
      const pdfPage = pdfDoc.addPage([width, height])
      pdfPage.drawImage(pdfImage, { x: 0, y: 0, width, height })
    }
    // save the pdf file
    const pdfBytes = await pdfDoc.save()
    const dataBuf = Buffer.from(pdfBytes)
    const savePDFName = epiStateFileJSON.info.comicDetail.title + '-' +
      epiStateFileJSON.info.comicDetail.episodesOrder + '-' +
      epiStateFileJSON.info.comicDetail.author + '-' +
      epiStateFileJSON.info.comicDetail.chineseTeam + '.pdf'
    const savePath = dialog.showSaveDialogSync({ defaultPath: savePDFName })
    if (typeof savePath === 'undefined') { return 'save_cancelled' }
    fs.writeFileSync(await resolveExtname(savePath, 'pdf'), dataBuf, 'binary')
    return 'save_success'
  } catch (err) {
    console.log(err, 'pack DPF has error')
    return 'save_error'
  }
}
