/**
 * rgb of the picture
 * @param {HTMLImageElement} el <img> element
 * @returns { { r: number, g: number, b: number } } rgb
 */
function getAverageRGB (el) {
  const blockSize = 5 // only visit every 5 pixels
  const defaultRGB = { r: 0, g: 0, b: 0 } // for non-supporting envs
  const canvas = document.createElement('canvas')
  const context = canvas.getContext && canvas.getContext('2d')
  const rgb = { r: 0, g: 0, b: 0 }

  if (!context) {
    return defaultRGB
  }

  const imgHeight = el.naturalHeight || el.offsetHeight || el.height
  const height = canvas.height = 50
  const width = canvas.width = 50

  el.crossOrigin = 'Anonymous'
  context.drawImage(el, 2, imgHeight - height, width, height, 0, 0, width, height)

  let data
  try {
    data = context.getImageData(0, 0, width, height)
  } catch (e) {
    return defaultRGB
  }

  const length = data.data.length

  let i = -4
  let count = 0
  while ((i += blockSize * 4) < length) {
    ++count
    rgb.r += data.data[i]
    rgb.g += data.data[i + 1]
    rgb.b += data.data[i + 2]
  }

  rgb.r = ~~(rgb.r / count)
  rgb.g = ~~(rgb.g / count)
  rgb.b = ~~(rgb.b / count)

  return rgb
}

function componentToHex (c) {
  var hex = c.toString(16)
  return hex.length === 1 ? '0' + hex : hex
}

export function getImgReverseColor (el) {
  const rgb = getAverageRGB(el)
  const reversedRGB = {
    r: 255 - rgb.r,
    g: 255 - rgb.g,
    b: 255 - rgb.b
  }
  return '#' + componentToHex(reversedRGB.r) + componentToHex(reversedRGB.g) + componentToHex(reversedRGB.b)
}
