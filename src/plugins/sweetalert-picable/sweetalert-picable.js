import Swal from 'sweetalert2'

import './swal-picable.less'

import { icon } from '@fortawesome/fontawesome-svg-core'
import { faXmark, faCheck } from '@fortawesome/free-solid-svg-icons'

const modal = Swal.mixin({
  customClass: {
    icon: 'swal2-icon-picable',
    htmlContainer: 'swal2-html-container-picable',
    confirmButton: 'swal2-confirm-picable',
    denyButton: 'swal2-deny-picable',
    cancelButton: 'swal2-cancel-picable'
  }
})
modal.error = modal.mixin({
  iconHtml: `<img src=${require('../../assets/img/loading/1.png')}/>`
})
modal.info = modal.mixin({
  iconHtml: `<img src=${require('../../assets/img/loading/10.png')}/>`
})
modal.warning = modal.mixin({
  iconHtml: `<img src=${require('../../assets/img/loading/10.png')}/>`
})
modal.success = modal.mixin({
  iconHtml: `<img src=${require('../../assets/img/loading/10.png')}/>`
})

const toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,

  didOpen: (toastDom) => {
    toastDom.addEventListener('mouseenter', Swal.stopTimer)
    toastDom.addEventListener('mouseleave', Swal.resumeTimer)
  },
  customClass: {
    icon: 'swal2-icon-toast-picable',
    timerProgressBar: 'swal2-timer-progress-bar-picable'
  }
})
toast.error = toast.mixin({
  iconHtml: `<span
    style="font-size:0.88em;margin-bottom:-2px;"
    >${icon(faXmark).html}</span>`,
  iconColor: '#f27474'
})
toast.info = toast.mixin({
  iconHtml: '<span>i</span>',
  iconColor: '#9de0f6'
})
toast.warning = toast.mixin({
  icon: 'warning'
})
console.log(icon(faCheck))
toast.success = toast.mixin({
  iconHtml: `<span
    style="font-size:.7em;margin-bottom:-3px;"
    >${icon(faCheck).html}</span>`,
  iconColor: '#a5dc86'
})

const swal = {
  ...{
    ...Swal,
    fire: undefined
  },
  modal,
  toast
}

// -----------------------+
// module export below
// -----------------------+
export { swal }

export default {
  install: (app) => {
    app.config.globalProperties.$swal = swal
  }
}
