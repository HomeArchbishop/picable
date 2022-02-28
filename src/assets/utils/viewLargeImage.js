import 'viewerjs/dist/viewer.css'
import { api as viewerApi } from 'v-viewer'

export const viewLargeImage = function (imgSrc) {
  viewerApi({
    images: [imgSrc],
    name: 'ss'
  })
}
