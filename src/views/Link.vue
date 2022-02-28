<template>
  <div class="link-container">
    <iframe :src="validLink" frameborder="0"></iframe>
  </div>
</template>

<script>
export default {
  name: 'Link',
  props: ['link'],
  computed: {
    validLink () {
      let validLink
      if (/^(https|http):\/\//.test(this.link)) {
        validLink = this.link
      } else if (/^\/\//.test(this.link)) {
        validLink = `https:${this.link}`
      } else {
        validLink = `https://${this.link}`
      }
      console.log(validLink)
      return validLink
    }
  }
}
</script>

<style lang="less" scoped>
.link-container {
  position: fixed;
  right: 0;
  left: 60px;
  top: 54px;
  bottom: 0;
  height: 100%;
  overflow-y: scroll;
  iframe {
    display: flex;
    flex: 1;
    width: 100%;
    height: 100%;
  }
}
</style>
