<template>
  <div class="diversion-container">
    <h1 >
      <span class="title-highlight-span">Picable</span>
      <sup class="badge">@{{ packageJSON.version }}</sup>
    </h1>
    <!-- <b>上次分流: 分流{{ ['一', '二', '三'][diversionUrlIndex] }}</b><br/> -->
    <!-- 因为安全策略，暂不支持切换分流。请科学上网 -->
    <div class="diversion-list">
      <div class="diversion-btn" @click="chose(0)">分流一</div>
      <!-- <div class="diversion-btn" @click="chose(1)">分流二</div>
      <div class="diversion-btn" @click="chose(2)">分流三</div> -->
    </div>
    <div class="conner">
      <span class="item shake-chunk" v-if="isNeedUpdate"
        @click="$api.openBrowser(packageJSON.notice.update)"
      >更新App</span>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import 'csshake'

export default {
  name: 'Diversion',
  data () {
    return {
      packageJSON: require('../../package.json')
    }
  },
  computed: {
    ...mapState({
      diversionUrlIndex: state => state.storage.diversionIndex,
      diversionUrlList: state => state.runtime.diversionUrlList
    }),
    isNeedUpdate () {
      return window.sessionStorage.getItem('__PICABLE__IS_NEED_UPDATE__') === 'true'
    }
  },
  methods: {
    async chose (nextDiversionIndex) {
      // show loading-pica animation
      this.$utils.showLoadingPica()
      // check token
      this.$store.commit('storage/setDiversionIndex', { nextDiversionIndex })
      try {
        const tokenResult = await this.$api.checkToken({ diversionUrl: this.diversionUrl, token: this.token })
        if (tokenResult) {
          this.$router.replace({ name: 'Home' })
        } else {
          this.$router.replace({ name: 'Login' })
        }
        // hide loading-pica animation
        this.$utils.hideLoadingPica()
      } catch {
        this.$utils.hideLoadingPica()
      }
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
  position: relative;
  user-select: none;
  cursor: default;
  h1 {
    display: flex;
    cursor: default;
    .title-highlight-span {
      color: @color-font-default-highlight;
      font-size: 60.6px;
      font-weight: 800;
    }
    .badge {
      color: @color-font-default-highlight;
      height: fit-content;
      font-size: .5em;
    }
  }
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
    // transition: .2s;
    cursor: pointer;
    &:not(:nth-child(1)) {
      margin-top: 12px;
    }
  }
}

.conner {
  text-align: right;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  .item {
    display: inline-block;
    color: #999;
    &::content {
      content: '';
    }
    &:not(:nth-child(1))::before {
      content: '| ';
    }
  }
}
</style>
