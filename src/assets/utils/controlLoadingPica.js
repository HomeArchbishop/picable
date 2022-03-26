import LoadingPica from '../../components/LoadingPica.ce.vue'
import { defineCustomElement } from 'vue'

// 转换为自定义元素构造器
const LoadingPicaElement = defineCustomElement(LoadingPica)
// 注册
customElements.define('loading-pica', LoadingPicaElement)

export const showLoadingPica = async function () {
  document.querySelector('#app').appendChild(
    new LoadingPicaElement()
  )
}

export const hideLoadingPica = async function () {
  document.querySelector('loading-pica').remove()
}
