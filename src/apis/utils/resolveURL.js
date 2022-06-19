export const resolveURL = function () {
  const URLArray = new Array(...arguments).reverse()
  return new URL(...URLArray).toString()
}
