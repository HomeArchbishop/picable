import fs from 'fs-extra'

function hasInjectionPath (pathStr) {
  return (
    !pathStr.startsWith(global.RUNTIME_DATA_PATH) ||
    /\.\./.test(pathStr)
  )
}

const fsSafe = new Proxy(fs, {
  get (target, prop) {
    if (typeof target[prop] === 'function') {
      return function (...args) {
        console.log('proxy', args[0], hasInjectionPath(args[0]))
        if (typeof args[0] === 'string' && hasInjectionPath(args[0])) {
          throw new TypeError('dangerous path string in fs')
        }
        return target[prop](...args)
      }
    }
    return target[prop]
  }
})

export default {
  ...fsSafe
}
