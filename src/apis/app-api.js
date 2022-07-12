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
  const recentComicIdSet = new Set(currentRecentComicIdList)
  recentComicIdSet.delete(comicId)
  recentComicIdSet.add(comicId)
  const recentComicIdList = Array.from(recentComicIdSet).reverse()
  window.electronAPI.writeRuntimeFile({ file: './recentComicIdList.json', content: JSON.stringify(recentComicIdList) })
}

export {
  favouriteAuthor, favouriteAuthorList,
  favouriteChinese, favouriteChineseList,
  openBrowser, getRecentComic,
  recordRecentComic
}
