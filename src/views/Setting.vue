<template>
  <div class="setting-container">
    <div class="info-item">
      <div>
        <div class="label">失焦模糊</div>
      </div>
      <div>
        <toggle-button :isChecked="blurOutOfFocus" @click="$store.commit('storage/setBlurOutOfFocus', { nextState: !blurOutOfFocus })" />
      </div>
    </div>
    <div class="info-item">
      <div>
        <div class="label">应用锁</div>
      </div>
      <div>
        <toggle-button :isChecked="hasAppLock" @click="toggleAppLock()" />
      </div>
    </div>
    <div class="info-item" v-if='hasAppLock'>
      <div>
        <div class="label">应用锁密码</div>
      </div>
      <div>
        <div v-if="!isChangingAppLockPassword">
          {{ isShowOriginAppLockPassword ? appLockPassword : ('*').repeat(appLockPassword.length) }}
          <font-awesome-icon :icon="isShowOriginAppLockPassword ? 'eye-slash' : 'eye'"
            @click="isShowOriginAppLockPassword = !isShowOriginAppLockPassword"
          />|
          <font-awesome-icon icon="pen" @click="isChangingAppLockPassword = true" v-if="!isChangingAppLockPassword" />
        </div>
        <form v-else @submit.prevent="changeAppLockPassword()">
          <input type="text" v-model="nextAppLockPassword">
          <div class="submit-btn" @click="changeAppLockPassword()">修改</div>|
          <div class="submit-btn" @click="isChangingAppLockPassword=false">取消</div>
        </form>
      </div>
    </div>
    <div class="hr-line">
      <div class="topic">阅读</div>
      <hr>
    </div>
    <div class="info-item">
      <div>
        <div class="label">阅读方式</div>
      </div>
      <div>
        <check-radio valueStr="column-scroll|row-scroll|row-slide" textStr="竖直|水平滑动|水平翻页" @checkChange="changeViewDirection" :checkedValue="viewDirection" />
      </div>
    </div>
    <div class="info-item" v-if="/^row-slide/.test(viewDirection)">
      <div>
        <div class="label">翻页方向</div>
      </div>
      <div>
        <check-radio valueStr="rl|lr" textStr="从右到左|从左到右" @checkChange="changeViewRL" :checkedValue="viewRL" />
      </div>
    </div>
    <div class="info-item">
      <div>
        <div class="label">懒加载</div>
      </div>
      <div>
        <toggle-button :isChecked="isUseLazyLoad" @click="toggleIsUseLazyLoad()" />
      </div>
    </div>
    <div class="info-item">
      <div>
        <div class="label">自动请求更多</div>
      </div>
      <div>
        <toggle-button :isChecked="isAutoUpdatePage" @click="toggleIsAutoUpdatePage()" />
      </div>
    </div>
    <div class="hr-line">
      <div class="topic">网络</div>
      <hr>
    </div>
    <div class="info-item">
      <div>
        <div class="label">使用https</div>
      </div>
      <div>
        <toggle-button :isChecked="isUseHttps" @click="toggleIsUseHttps()" />
      </div>
    </div>
    <!-- <div class="info-item">
      <div>
        <div class="label">代理</div>
      </div>
      <div>
        <toggle-button :isChecked="isUseHttps" @click="toggleIsUseHttps()" />
      </div>
    </div> -->
    <div class="hr-line">
      <div class="topic">软件信息</div>
      <hr>
    </div>
    <div class="info-item">
      <div>
        <div class="label">版本</div>
      </div>
      <div>
        @{{ packageJSON.version }}
        <a href="." v-if="isNeedUpdate"
          @click.prevent="$api.openBrowser(packageJSON.notice.update)"
        >前往更新</a>
      </div>
    </div>
    <div class="info-item">
      <div>
        <div class="label">开源许可证</div>
      </div>
      <div>{{ packageJSON.license }}</div>
    </div>
    <div class="info-item">
      <div>
        <div class="label">GitHub地址</div>
      </div>
      <a href="."
        @click.prevent="$api.openBrowser(packageJSON.repository.github)"
      >{{ packageJSON.repository.github }}</a>
    </div>
    <div class="hr-line">
      <hr>
    </div>
    <div>
      <h3>开发者碎碎念</h3>
      <p>
        感谢您使用「Picable」。我本来是自用的，后来把这个项目发出来，希望大家能够喜欢。如果Star一下当然更好啦，一个Star能够让我兴奋好久😚。
      </p>
      <p>
        「Picable」中并没有添加广告，只是为了提升电脑端的阅读体验。但我们不愿看到未来发生悲剧。还望各位力所能及时，多多在手机端「点广告，救哔咔」。
      </p>
    </div>
    <div class="hr-line">
      <hr>
    </div>
    <div>
      <h3>声明</h3>
      <p>
        Picable（下称“本软件”）是<strong><u>非官方</u></strong>的免费哔咔漫画客户端。
      </p>
      <p>
        本软件提供的内容仅用于个人学习、研究或欣赏。通过使用本站内容随之而来的风险与本站无关
      </p>
      <p>
        使用者可将本软件及其源码依据MIT开源协议使用。
      </p>
      <p>
        本软件不提供任何形式的保证。所有与使用本站相关的直接风险均由用户承担。
      </p>
      <p>
        当您使用本软件时，说明您已经同意并接受本页面的所有信息。
      </p>
    </div>
  </div>
</template>

<script>
import { library } from '@fortawesome/fontawesome-svg-core'
import { faEye, faEyeSlash, faPen } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import ToggleButton from '../components/ToggleButton'
import CheckRadio from '../components/CheckRadio'
import { mapState } from 'vuex'
import Swal from '../assets/utils/sweetalert-picable'

library.add(faEye, faEyeSlash, faPen)

export default {
  name: 'Setting',
  components: {
    ToggleButton,
    FontAwesomeIcon,
    CheckRadio
  },
  data () {
    return {
      isShowOriginAppLockPassword: false,
      isChangingAppLockPassword: false,
      nextAppLockPassword: this.$store.state.storage.appLockPassword,
      packageJSON: require('../../package.json')
    }
  },
  computed: {
    ...mapState({
      blurOutOfFocus: state => state.storage.blurOutOfFocus,
      hasAppLock: state => state.storage.hasAppLock,
      appLockPassword: state => state.storage.appLockPassword,
      isUseHttps: state => state.storage.isUseHttps,
      viewDirection: state => state.storage.imgViewerSettings.direction,
      viewRL: state => state.storage.imgViewerSettings.rl,
      isUseLazyLoad: state => state.storage.imgViewerSettings.lazyLoad,
      isAutoUpdatePage: state => state.storage.imgViewerSettings.autoUpdatePage
    }),
    isNeedUpdate () {
      return window.sessionStorage.getItem('__PICABLE__IS_NEED_UPDATE__') === 'true'
    }
  },
  methods: {
    toggleAppLock () {
      this.$store.commit('storage/setHasAppLock', { nextState: !this.hasAppLock })
      if (this.hasAppLock) {
        Swal.fire({
          title: '已开启应用锁，请牢记密码',
          html: `密码：${this.appLockPassword}<br>记不住的话，可不好找回哦～`,
          icon: 'info'
        })
      }
    },
    changeAppLockPassword () {
      this.$store.commit('storage/setAppLockPassword', { nextAppLockPassword: this.nextAppLockPassword })
      this.isChangingAppLockPassword = false
    },
    toggleIsUseHttps () {
      this.$store.commit('storage/setIsUseHttps', { isUseHttps: !this.isUseHttps })
    },
    changeViewDirection (nextVal) {
      this.$store.commit('storage/setImgViewerSettings', { direction: nextVal })
    },
    changeViewRL (nextVal) {
      this.$store.commit('storage/setImgViewerSettings', { rl: nextVal })
    },
    toggleIsUseLazyLoad () {
      this.$store.commit('storage/setImgViewerSettings', { lazyLoad: !this.isUseLazyLoad })
    },
    toggleIsAutoUpdatePage () {
      this.$store.commit('storage/setImgViewerSettings', { autoUpdatePage: !this.isAutoUpdatePage })
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/themes/config';
@import '~@/assets/themes/@{theme-name}/theme';
.setting-container {
  .info-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin: 24px 0;
    div .label {
      font-size: 18px;
      opacity: .78;
    }
    form {
      input {
        display: inline-block;
        padding: 0 5px;
        font-size: 20px;
        padding: 0 10px 0 0;
        width: 10em;
        font-size: 18px;
        font-family: inherit;
        border: none;
        border-bottom: 2px solid @color-line-default-sub;
        box-sizing: content-box;
        background-color: transparent;
        outline: none;
        transition: .2s;
        text-align: right;
        &:focus {
          border-bottom: 2px solid @color-line-default;
        }
      }
      .submit-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 4px 3px 4px 3px;
        border: none;
        background-color: transparent;
        outline: none;
        cursor: pointer;

        &:hover {
          transform: scale(110%);
        }
        .hoverable-btn()
      }
    }
  }
  .hr-line {
    display: flex;
    flex-direction: row;
    .topic {
      display: inline-block;
      font-weight: 300;
      font-size: small;
    }
    hr {
      display: flex;
      flex: 1;
      border: none;
      border-bottom: 1px solid @color-font-default-sub;
    }
  }
}
</style>
