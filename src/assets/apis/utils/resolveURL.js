export const resolveURL = function () {
  const URLArray = new Array(...arguments)
  if (URLArray.length === 1) { return URLArray[0] }
  return URLArray.reduce((s, u) => {
    if (/^.+\/$/.test(s)) {
      s = s.slice(0, s.length - 1)
    }
    if (/^\//.test(u)) {
      u = u.slice(1)
    }
    return s + '/' + u
  })
}
