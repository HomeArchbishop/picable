import { globalShortcut } from 'electron'

function registerGlobalShortcutInOrder (accelerator, callBackFn, time = 500) {
  const acceleratorList = accelerator.split('++')
  if (acceleratorList.length === 1) {
    globalShortcut.register(acceleratorList[0], () => {
      (callBackFn && callBackFn.call) ? callBackFn.call() : console.log(callBackFn)
    })
    return
  }
  const fnStack = []
  fnStack[acceleratorList.length - 1] = () => {
    globalShortcut.register(acceleratorList[acceleratorList.length - 1], () => {
      globalShortcut.unregister(acceleratorList[acceleratorList.length - 1])
      ;(callBackFn && callBackFn.call) ? callBackFn.call() : console.log(callBackFn)
    })
  }
  for (let i = acceleratorList.length - 2; i > 0; i--) {
    fnStack[i] = () => {
      globalShortcut.register(acceleratorList[i], () => {
        globalShortcut.unregister(acceleratorList[i])
        fnStack[i + 1]()
        setTimeout(() => { globalShortcut.unregister(acceleratorList[i + 1]) }, time)
      })
    }
  }
  globalShortcut.register(acceleratorList[0], () => {
    fnStack[1]()
    setTimeout(() => { globalShortcut.unregister(acceleratorList[1]) }, time)
  })
}

export function registerGlobalShortcut (app) {
  registerGlobalShortcutInOrder('CommandOrControl+Alt+,++,++,++,++,', () => { app.quit() }, 800)
}
