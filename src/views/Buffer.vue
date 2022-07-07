<template>
  <div class="buffer-container"></div>
</template>

<script>
export default {
  name: 'Buffer',
  created () {
    console.log(window.location.href, this.$store.state.storage.hasAppLock)
    if (!this.$store.state.storage.hasAppLock) {
      this.$router.replace({ name: 'Diversion' })
    } else {
      this.$router.replace({ name: 'AppLock' })
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/themes/config';
@import '~@/assets/themes/@{theme-name}/theme';
.buffer-container {
  height: 70vh;
}
</style>
