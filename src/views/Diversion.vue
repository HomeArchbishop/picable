<template>
  <div class="diversion-container">
    <h1 >
      <span class="title-highlight-span">PicAcg</span>
    </h1>
    <!-- <b>上次分流: 分流{{ ['一', '二', '三'][diversionUrlIndex] }}</b><br/> -->
    <!-- 因为安全策略，暂不支持切换分流。请科学上网 -->
    <div class="diversion-list">
      <div class="diversion-btn" @click="chose(0)" :class="{ loading: !$store.state.runtime.diversionUrlList[0] }">分流一</div>
      <!-- <div class="diversion-btn" @click="chose(1)" :class="{ loading: !$store.state.runtime.diversionUrlList[1] }">分流二</div>
      <div class="diversion-btn" @click="chose(2)" :class="{ loading: !$store.state.runtime.diversionUrlList[2] }">分流三</div> -->
    </div>
    <div class="conner">
      <span class="item shake-chunk" v-if="isNeedUpdate"
        @click="$api.openBrowser(packageJSON.notice.update)"
      >应用更新</span>
      <br>
      <span class="item">picable@{{ packageJSON.version }}</span>
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
      if (!this.$store.state.runtime.diversionUrlList[nextDiversionIndex]) {
        return
      }
      // show loading-pica animation
      this.$utils.showLoadingPica()
      // check token
      this.$store.commit('storage/setDiversionIndex', { nextDiversionIndex })
      console.log(this.diversionUrl, nextDiversionIndex)
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
    // animation-name: shake;
    animation-duration: .3s;
    animation-delay: 1.3s;
    animation-timing-function: ease;
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
    &.loading {
      opacity: .5;
      cursor: wait;
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
  }
}

@keyframes shake {
  0% {
    transform: translateX(0);
  }
  5% {
    transform: translateX(-20px);
  }
  25% {
    transform: translateX(-40px);
  }
  45% {
    transform: translateX(-20px);
  }
  50% {
    transform: translateX(0);
  }
  55% {
    transform: translateX(20px);
  }
  75% {
    transform: translateX(40px);
  }
  95% {
    transform: translateX(20px);
  }
  100% {
    transform: translateX(0);
  }
}
</style>
