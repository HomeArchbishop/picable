function resolveCSSLengthString (value) {
  if (typeof value === 'string') {
    return value
  }
  if (typeof value === 'number') {
    if (!value) { // 0 or NaN
      return '0'
    } else {
      return '' + value + 'px'
    }
  }
  // Ehhhh...
  // this is a bad code.
  // Here actually lies a type error,
  // but this plugin is for myself,
  // let it go, anyway...
  return '0'
}
export default {
  install: (app) => {
    app.directive('width', (el, binding) => {
      el.style.width = resolveCSSLengthString(binding.value)
    })
    app.directive('height', (el, binding) => {
      el.style.height = resolveCSSLengthString(binding.value)
    })
    app.directive('rect', (el, binding) => {
      el.style.width = resolveCSSLengthString(binding.value.width)
      el.style.height = resolveCSSLengthString(binding.value.height)
    })
  }
}
