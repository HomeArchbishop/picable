import _Swal from 'sweetalert2'

const Swal = _Swal.mixin({
  customClass: {
    htmlContainer: 'swal2-container-custom'
  }
})

export { Swal }

export default {
  install: (app) => {
    app.config.globalProperties.$swal = Swal
  }
}
