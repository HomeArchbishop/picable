<template>
  <div class="diversion-container">
    <h2>请选择分流</h2>
    <b>上次分流: 分流{{ ['一', '二', '三'][diversionUrlIndex] }}</b><br/>
    <!--因为安全策略，暂不支持切换分流。请科学上网-->
    <div class="diversion-list">
      <div class="diversion-btn" @click="chose(0)">分流一</div>
      <!--<div class="diversion-btn" @click="chose(1)">分流二</div>
      <div class="diversion-btn" @click="chose(2)">分流三</div>-->
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Diversion',
  computed: {
    ...mapState({
      diversionUrlIndex: state => state.storage.diversionIndex,
      diversionUrlList: state => state.runtime.diversionUrlList
    })
  },
  methods: {
    async chose (nextDiversionIndex) {
      // show loading-pica animation
      this.$utils.showLoadingPica()
      // check token
      this.$store.commit('storage/setDiversionIndex', { nextDiversionIndex })
      const tokenResult = await this.$api.checkToken({ diversionUrl: this.diversionUrl, token: this.token })
      if (tokenResult) {
        this.$router.replace({ name: 'Home' })
      } else {
        this.$router.replace({ name: 'Login' })
      }
      // hide loading-pica animation
      this.$utils.hideLoadingPica()
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/themes/config';
@import '~@/assets/themes/@{theme-name}/theme';
.diversion-container {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 70vh;
  opacity: .89;
}
.diversion-list {
  display: flex;
  flex-direction: column;
  .diversion-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    width: 200px;
    background: @background-btn-default;
    border-radius: .75em;
    transition: .2s;
    cursor: pointer;
    &:not(:nth-child(1)) {
      margin-top: 12px;
    }
  }
}
</style>
