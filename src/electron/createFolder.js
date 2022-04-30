import fs from 'fs'
import path from 'path'

export function createFolder (to) {
  const sep = path.sep
  const folders = path.dirname(to).split(sep).reverse()
  let p = ''
  while (folders.length) {
    p += folders.pop() + sep
    if (!fs.existsSync(p)) {
      fs.mkdirSync(p)
    }
  }
}
