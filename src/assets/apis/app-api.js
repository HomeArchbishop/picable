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

export {
  favouriteAuthor, favouriteAuthorList,
  favouriteChinese, favouriteChineseList,
  openBrowser
}
