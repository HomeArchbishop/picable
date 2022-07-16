const favouriteAuthorList = async function () {
  return await window.electronAPI.existRuntimeFile({ file: './favouriteAuthorList.json' })
    ? JSON.parse(await window.electronAPI.readRuntimeFile({ file: './favouriteAuthorList.json' }))
    : []
}

const favouriteAuthor = async function (author) {
  const currentFavouriteAuthorList = await window.electronAPI.existRuntimeFile({ file: './favouriteAuthorList.json' })
    ? JSON.parse(await window.electronAPI.readRuntimeFile({ file: './favouriteAuthorList.json' }))
    : []
  const favouriteAuthorSet = new Set(currentFavouriteAuthorList)
  if (favouriteAuthorSet.has(author)) {
    favouriteAuthorSet.delete(author)
  } else {
    favouriteAuthorSet.add(author)
  }
  const favouriteAuthorList = Array.from(favouriteAuthorSet).reverse()
  await window.electronAPI.writeRuntimeFile({ file: './favouriteAuthorList.json', content: JSON.stringify(favouriteAuthorList) })
}

const favouriteChineseList = async function () {
  return await window.electronAPI.existRuntimeFile({ file: './favouriteChineseList.json' })
    ? JSON.parse(await window.electronAPI.readRuntimeFile({ file: './favouriteChineseList.json' }))
    : []
}

const favouriteChinese = async function (chineseTeam) {
  const currentFavouriteChineseList = await await window.electronAPI.existRuntimeFile({ file: './favouriteChineseList.json' })
    ? JSON.parse(await window.electronAPI.readRuntimeFile({ file: './favouriteChineseList.json' }))
    : []
  const favouriteChineseSet = new Set(currentFavouriteChineseList)
  if (favouriteChineseSet.has(chineseTeam)) {
    favouriteChineseSet.delete(chineseTeam)
  } else {
    favouriteChineseSet.add(chineseTeam)
  }
  const favouriteChineseList = Array.from(favouriteChineseSet).reverse()
  await window.electronAPI.writeRuntimeFile({ file: './favouriteChineseList.json', content: JSON.stringify(favouriteChineseList) })
}

const openBrowser = async function (url) {
  window.electronAPI.openBrowser({ url })
}

const getRecentComic = async function () {
  if (await window.electronAPI.existRuntimeFile({ file: './recentComicIdList.json' })) {
    return JSON.parse(await window.electronAPI.readRuntimeFile({ file: './recentComicIdList.json' }))
  } else {
    return []
  }
}

const recordRecentComic = async function (comicId) {
  const currentRecentComicIdList = await getRecentComic()
  currentRecentComicIdList.reverse()
  const recentComicIdSet = new Set(currentRecentComicIdList)
  recentComicIdSet.delete(comicId)
  recentComicIdSet.add(comicId)
  const recentComicIdList = Array.from(recentComicIdSet).reverse()
  window.electronAPI.writeRuntimeFile({ file: './recentComicIdList.json', content: JSON.stringify(recentComicIdList) })
}

const getRememberAccount = async function () {
  if (await window.electronAPI.existRuntimeFile({ file: './rememberAccountList.json' })) {
    return JSON.parse(await window.electronAPI.readRuntimeFile({ file: './rememberAccountList.json' }))
  } else {
    return []
  }
}

const updateRememberAccount = async function (_nextList) {
  // ensure no repeat
  const nextList = Array.from(new Set(_nextList))
  await window.electronAPI.writeRuntimeFile({ file: './rememberAccountList.json', content: JSON.stringify(nextList) })
}

const downloadComic = async function ({ comicDownloadInfo }) {
  await window.electronAPI.downloadComic({ comicDownloadInfo })
}

const cancelDownloadComic = async function ({ comicId, episodesOrder }) {
  await window.electronAPI.cancelDownloadComic({ comicId, episodesOrder })
}

const downloadTree = async function () {
  if (!window.electronAPI.existRuntimeDir({ dir: './download' })) {
    return []
  }
  const tree = []
  const comicIdList = (await window.electronAPI.readRuntimeDir({ dir: './download' })).filter(s => !s.startsWith('.'))
  for (const comicId of comicIdList) {
    const epiOrderListOrigin = (await window.electronAPI.readRuntimeDir({ dir: `./download/${comicId}` })).filter(s => !s.startsWith('.'))
    const epiOrderList = []
    for (const epiOrder of epiOrderListOrigin) {
      if (await window.electronAPI.existRuntimeFile({ file: `./download/${comicId}/${epiOrder}/epi.json` })) {
        epiOrderList.push(epiOrder)
      }
    }
    if (epiOrderList.length) {
      tree[comicId] = epiOrderList
    }
  }
  return tree
}

const downloadEpiState = async function ({ comicId, epiOrder }) {
  if (!window.electronAPI.existRuntimeFile({ file: `./download/${comicId}/${epiOrder}/epi.json` })) {
    throw Error('file: epi.json not exists')
  }
  return JSON.parse(await window.electronAPI.readRuntimeFile({ file: `./download/${comicId}/${epiOrder}/epi.json` }))
}

const packPDF = async function ({ comicId, episodesOrder }) {
  return await window.electronAPI.packPDF({ comicId, episodesOrder })
}

const packZIP = async function ({ comicId, episodesOrder }) {
  return await window.electronAPI.packZIP({ comicId, episodesOrder })
}

export {
  favouriteAuthor, favouriteAuthorList,
  favouriteChinese, favouriteChineseList,
  openBrowser, getRecentComic,
  recordRecentComic,
  updateRememberAccount, getRememberAccount,
  downloadComic, cancelDownloadComic,
  downloadTree, downloadEpiState,
  packPDF, packZIP
}
