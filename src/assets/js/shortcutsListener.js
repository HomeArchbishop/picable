import deepcopy from 'deepcopy'

const routeToHideSecret = function () {
  this.$router.push({ name: 'HideSecret' })
}

const routeLeaveHideSecret = function () {
  if (this.$route.name !== 'HideSecret') { return }
  if (!this.$route.meta.from?.name) {
    this.$router.replace({ name: 'Diversion' })
  } else if (this.$route.meta.from.fullPath === this.$route.fullPath) {
    this.$router.replace({ name: 'Diversion' })
  } else {
    this.$router.replace(this.$route.meta.from.fullPath)
  }
}

const shortcutsListener = (() => {
  let vm
  let oldShortcuts
  let Mousetrap
  return {
    install (_vm) {
      vm = _vm
      if (vm?.$store?.state?.storage?.shortcuts) {
        oldShortcuts = deepcopy(vm.$store.state.storage.shortcuts)
      }
      Mousetrap = vm.$mousetrap
    },
    start () {
      oldShortcuts = deepcopy(vm.$store.state.storage.shortcuts)
      Mousetrap.bind(vm.$store.state.storage.shortcuts.routeToHideSecret, routeToHideSecret.bind(vm))
      Mousetrap.bind(vm.$store.state.storage.shortcuts.routeLeaveHideSecret, routeLeaveHideSecret.bind(vm))
    },
    stop () {
      console.log(oldShortcuts)
      Mousetrap.unbind(oldShortcuts.routeToHideSecret)
      Mousetrap.unbind(oldShortcuts.routeLeaveHideSecret)
    },
    restart () {
      this.stop()
      this.start()
    }
  }
})()

export default shortcutsListener
