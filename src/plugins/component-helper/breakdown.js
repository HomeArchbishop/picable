import { reset } from './reset'

import { icon } from '@fortawesome/fontawesome-svg-core'
import { faXmarkSquare } from '@fortawesome/free-solid-svg-icons'

export function breakdown () {
  if (this === undefined) {
    throw TypeError('`this` is not binded to vue ctx when calling $compHelper')
  }

  new Promise((resolve, reject) => {
    if (this.$el) {
      resolve()
      return
    }
    const timer = setTimeout(() => {
      clearInterval(interval)
      reject(Error('`this.$el` does not exist in `$compHelper.breakdown`'))
    }, 2000)
    const interval = setInterval(() => {
      if (this.$el) {
        clearTimeout(timer)
        resolve()
      }
    }, 100)
  })
    .catch()
    .then(() => {
      [...this.$el.children].forEach(element => {
        element.style.visibility = 'hidden'
      })

      const template = document.createElement('div')
      template.innerHTML = `
      <div
      style="
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: calc(100% - 80px);
        position: fixed;
        top: 20vh;
      "
      >
        <span
          style="
            font-size: 180px;
            margin: 0 0 -40px 0;
            color: #d66e9e77;
          "
        >
          ${icon(faXmarkSquare).html}
        </span>
        <small
          style="
            color: grey;
            margin-bottom: 20px;
          "
        >
          哔咔发生错误
        </small>
        <div
          id="picableBreakdownReloadBtn"
          style="
            padding: 8px 16px;
            border-radius: .75em;
            background: #99999944;
            width: fit-content;
            user-select: none;
            cursor: pointer;
            transition: .2s;
            opacity: .78;
          "
          onmouseover="this.style.transform='scale(110%)'"
          onmouseleave="this.style.transform='scale(100%)'"
        >
          重试
        </div>
      </div>  
      `

      const reloadBtnDom = template.querySelector('#picableBreakdownReloadBtn')
      const childrenDom = [...template.children]

      this.$el.append(...childrenDom)

      reloadBtnDom.addEventListener('click', () => {
        childrenDom.forEach(el => el.remove())
        ;[...this.$el.children].forEach(el => {
          el.style.visibility = 'unset'
        })
        console.log('sss')
        reset.call(this)
      })
    })
}
