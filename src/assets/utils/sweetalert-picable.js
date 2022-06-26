import _Swal from 'sweetalert2'

const Swal = _Swal.mixin({
  customClass: {
    htmlContainer: 'swal2-container-custom'
  }
})

export default Swal
