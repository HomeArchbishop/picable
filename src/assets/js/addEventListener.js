import Mousetrap from 'mousetrap'

export function startListener (router, route) {
  Mousetrap.bind(['command+k', 'ctrl+k'], () => {
    router.push({ name: 'HideSecret' })
  })
  Mousetrap.bind(['command+shift+k', 'ctrl+shift+k'], () => {
    if (route.name === 'HideSecret') {
      router.back()
    }
  })
}
