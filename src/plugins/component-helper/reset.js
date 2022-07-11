import { isFunction } from 'lodash'

export function reset () {
  if (this === undefined) {
    throw TypeError('`this` is not binded to vue ctx when calling $compHelper')
  }

  Object.assign(this.$data, this.$options.data.call(this))

  this.$options.beforeUnmount && this.$options.beforeUnmount.call(this)
  this.$options.unmounted && this.$options.unmounted.call(this)

  this.$options.beforeCreate && this.$options.beforeCreate.call(this)

  // watch immediate
  const watch = this.$options.watch
  for (const watchKey in watch) {
    if (!isFunction(watch[watchKey]) && watch[watchKey].immediate) {
      const value = watchKey.split('.').reduce((p, c) => p[c], this)
      watch[watchKey].handler.call(this, value, value)
    }
  }

  this.$options.created && this.$options.created.call(this)
  this.$options.activated && this.$options.activated.call(this)
  this.$options.beforeMount && this.$options.beforeMount.call(this)
  this.$options.mounted && this.$options.mounted.call(this)
}
