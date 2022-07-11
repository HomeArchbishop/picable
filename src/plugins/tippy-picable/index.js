import tippy from 'tippy.js'
import 'tippy.js/dist/tippy.css'
import 'tippy.js/animations/shift-away.css'

export default {
  install: (app) => {
    app.directive('tippy', (el, binding) => {
      if (!binding.value) { return }
      tippy(el, {
        content: binding.value,
        allowHTML: true,
        animation: 'shift-away'
      })
    })
  }
}
