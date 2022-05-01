import Mousetrap from 'mousetrap'

export function startListener (vue) {
  Mousetrap.bind(['command+k', 'ctrl+k'], () => {
    vue.$router.push({ name: 'HideSecret' })
  })
  Mousetrap.bind(['command+shift+k', 'ctrl+shift+k'], () => {
    // console.log(vue.$router)
    if (vue.$route.name !== 'HideSecret') { return }
    if (!vue.$route.meta.from?.name) {
      vue.$router.replace({ name: 'Diversion' })
    } else if (vue.$route.meta.from.fullPath === vue.$route.fullPath) {
      vue.$router.replace({ name: 'Diversion' })
    } else {
      vue.$router.replace(vue.$route.meta.from.fullPath)
    }
  })
}
