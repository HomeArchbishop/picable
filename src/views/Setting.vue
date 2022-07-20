<template>
  <div class="setting-container">
    <!-- 基础 -->
    <div>
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
      <div class="info-item">
        <div>
          <div class="label">登录</div>
        </div>
        <div>
          <a href="." @click.prevent="logout">登出</a>
        </div>
      </div>
    </div>
    <!-- 阅读 -->
    <div>
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
    </div>
    <!-- 高级 -->
    <div v-if="!isInSubView">
      <div class="hr-line">
        <div class="topic">高级</div>
        <hr>
      </div>
      <div class="info-item">
        <div>
          <div class="label">主页模块</div>
        </div>
        <div>
          <a href="." @click.prevent="isShowHomePageModuleSubView = true">点击设置</a>
        </div>
      </div>
      <div class="info-item">
        <div>
          <div class="label">快捷键</div>
        </div>
        <div>
          <a href="." @click.prevent="isShowShortcutsSubView = true">点击设置</a>
        </div>
      </div>
    </div>
    <!-- 网络 -->
    <div v-if="!isInSubView">
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
      <div class="info-item">
        <div>
          <div class="label">代理</div>
        </div>
        <div>
          <a href="." @click.prevent="isShowProxySubView = true">点击设置</a>
        </div>
      </div>
      <div class="info-item">
        <div>
          <div class="label">延时</div>
        </div>
        <div>
          <span class="display-word" v-if="!isNetworkSpeedTest && network.rtt">{{ network.rtt }}ms</span>
          <span class="display-word" v-if="!isNetworkSpeedTest && isNaN(network.rtt)">网络出错</span>
          <a href="." @click.prevent="networkSpeedTest()" v-if="!isNetworkSpeedTest">点击测速</a>
          <a v-else>正在测速</a>
        </div>
      </div>
    </div>
    <!-- 软件信息 -->
    <div v-if="!isInSubView">
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
    </div>
    <!-- 其他 -->
    <div v-if="!isInSubView">
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

    <sub-view view-name="主页模块" title-highlight v-if="isShowHomePageModuleSubView" @hide="isShowHomePageModuleSubView = false">
      <draggable-wrap v-model="homePageModuleSubViewDraggableItemList"
        item-key="partName" handle=".handle" animation="200" ghostClass="drag-ghost"
      >
        <template #item="{ element }">
          <div class="info-item draggable-item">
            <div>
              <div class="handle">
                <font-awesome-icon icon="bars" />
              </div>
              <div class="label">{{ element.title }}</div>
            </div>
            <div>
              <toggle-button :isChecked="homePageModule.part[element.partName]" @click="toggleHomePageModule(element.partName)" />
            </div>
          </div>
        </template>
      </draggable-wrap>
      <small class="small-tip">【说明】订阅的项目将展示在主页，可拖动进行排序。由于网络原因（防火墙/反爬等），过多订阅可能会影响加载体验，请适当订阅。</small>
    </sub-view>

    <sub-view view-name="快捷键" title-highlight v-if="isShowShortcutsSubView" @hide="isShowShortcutsSubView = false">
      <div class="info-item"
        v-for="[label, key] in [
          ['进入隐藏模式', 'routeToHideSecret'], ['离开隐藏模式', 'routeLeaveHideSecret'],
          ['水平阅读（下一页）', 'comicViewerRowNext'], ['水平阅读（上一页）', 'comicViewerRowLast'],
          ['竖直阅读（下一页）', 'comicViewerColumnNext'], ['竖直阅读（上一页）', 'comicViewerColumnLast']]"
        :key="key"
      >
        <div>
          <div class="label">{{ label }}</div>
        </div>
        <div v-if="shortcutRecordingKey !== key">
          <span class="display-word">{{ shortcutsReadable[key].join(' ') }}</span>
          <a href="." @click.prevent="setShortcuts(key)">自定义</a>
        </div>
        <div v-else>
          <span class="display-word">请键入快捷键</span>
        </div>
      </div>
      <small class="small-tip">【说明】在这里定义的快捷键，只有在App被聚焦时才有效哦。</small><br>
      <small class="small-tip">【重要】目前自定义快捷键时可能存在隐性bug（如win7），请谨慎使用。如果出现键盘卡死等异常，请尝试菜单栏上的「视图」->「重载页面」</small>
    </sub-view>

    <sub-view view-name="代理" title-highlight v-if="isShowProxySubView" @hide="isShowProxySubView = false">
      <div class="info-item">
        <div>
          <div class="label">启用代理</div>
        </div>
        <div>
          <toggle-button :isChecked="proxyArgs.isUseProxy" @click="proxyArgs.isUseProxy = !proxyArgs.isUseProxy" />
        </div>
      </div>
      <div class="info-item">
        <div>
          <div class="label" v-tippy="'示例 localhost:7890'">代理地址</div>
        </div>
        <div>
          <form @submit.prevent>
            <input type="text" v-model="proxyArgs.proxyURL">
          </form>
        </div>
      </div>
      <div class="info-item">
        <div>
          <div class="label" v-tippy="'开启时，本地的请求仍会使用代理'">本地地址仍启用代理</div>
        </div>
        <div>
          <toggle-button :isChecked="proxyArgs.isLocalNeedProxy" @click="proxyArgs.isLocalNeedProxy = !proxyArgs.isLocalNeedProxy" />
        </div>
      </div>
      <!-- <div class="info-item">
        <div>
          <div class="label" v-tippy="'开启时，如果系统有代理，会使用系统代理而非此处的代理'">优先使用系统代理</div>
        </div>
        <div>
          <toggle-button :isChecked="proxyArgs.isSystemFirst" @click="proxyArgs.isSystemFirst = !proxyArgs.isSystemFirst" />
        </div>
      </div> -->
      <div class="info-item">
        <div class="big-btn" @click="setProxy()">保存</div>
      </div>
      <small class="small-tip">【说明】请记住点保存按钮。</small>
    </sub-view>
  </div>
</template>

<script>
import { library } from '@fortawesome/fontawesome-svg-core'
import { faEye, faEyeSlash, faPen, faBars } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import ToggleButton from '../components/ToggleButton'
import CheckRadio from '../components/CheckRadio'
import SubView from '../components/SubView.vue'
import DraggableWrap from 'vuedraggable'
import { mapState } from 'vuex'

library.add(faEye, faEyeSlash, faPen, faBars)

export default {
  name: 'Setting',
  props: {
    isInSubView: {
      type: Boolean,
      default: false
    }
  },
  components: {
    ToggleButton,
    FontAwesomeIcon,
    CheckRadio,
    SubView,
    DraggableWrap
  },
  data () {
    return {
      isShowOriginAppLockPassword: false,
      isChangingAppLockPassword: false,
      nextAppLockPassword: this.$store.state.storage.appLockPassword,
      isShowHomePageModuleSubView: false,
      isShowShortcutsSubView: false,
      isShowProxySubView: false,
      shortcutRecordingKey: '',
      proxyArgs: this.$store.state.runtime.proxyArgs,
      // => { isUseProxy, proxyURL, isLocalNeedProxy, isSystemFirst }
      network: { rtt: 0 },
      isNetworkSpeedTest: false,
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
      isAutoUpdatePage: state => state.storage.imgViewerSettings.autoUpdatePage,
      homePageModule: state => state.storage.homePageModule,
      shortcuts: state => state.storage.shortcuts
    }),
    isNeedUpdate () {
      return window.sessionStorage.getItem('__PICABLE__IS_NEED_UPDATE__') === 'true'
    },
    shortcutsReadable () {
      const readable = {}
      for (const key in this.shortcuts) {
        // though `navigator.platform` is deprecated, Mousetrap uses it for 'mod' alias,
        // so we keep using it here
        const modReadable = /Mac|iPod|iPhone|iPad/.test(navigator.platform) ? '⌘' : 'ctrl'
        readable[key] = this.shortcuts[key].map(s => s.replace(/mod/gi, modReadable).replace(/meta/gi, '⌘'))
      }
      return readable
    },
    homePageModuleSubViewDraggableItemList: {
      get () {
        const referTitle = { normalMei: '本子妹推荐', normalMu: '本子母推荐', rankH24: '每日排行榜', rankD7: '每周排行榜', rankD30: '每月排行榜' }
        const order = this.$store.state.storage.homePageModule.order
        return order.map(partName => ({ title: referTitle[partName], partName }))
      },
      set (value) {
        const nextOrder = value.map(item => item.partName)
        this.$store.commit('storage/setHomePageModuleOrder', { nextOrder })
      }
    }
  },
  methods: {
    toggleAppLock () {
      this.$store.commit('storage/setHasAppLock', { nextState: !this.hasAppLock })
      if (this.hasAppLock) {
        this.$swal.modal.info.fire({
          title: '已开启应用锁，请牢记密码',
          html: `<span style="color:#d66e9e">
            密码：${this.appLockPassword}
            </span><br>记不住的话，可不好找回哦～`
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
    },
    toggleHomePageModule (key) {
      this.$store.commit('storage/setHomePageModulePart', { key, nextValue: !this.homePageModule.part[key] })
    },
    async logout () {
      this.$swal.modal.warning.fire({
        title: '确定退出登录吗？',
        text: '您的浏览记录、下载将不会被删除',
        showCancelButton: true,
        cancelButtonText: '取消',
        confirmButtonText: '确认登出',
        reverseButtons: true
      }).then(result => {
        if (result.isConfirmed) {
          this.$store.commit('storage/setToken', { nextToken: '' })
          this.$router.replace({ name: 'Diversion' })
        }
      })
    },
    setShortcuts (key) {
      this.shortcutRecordingKey = key
      this.$mousetrap.pause()
      return new Promise((resolve, reject) => {
        const end = () => {
          resolve()
          this.shortcutRecordingKey = ''
          this.$mousetrap.unpause()
        }
        const timer = setTimeout(() => {
          end() // do not reject it, or it will throw an err
        }, 3000)
        this.$mousetrap.record((sequence) => {
          clearTimeout(timer)
          // sequence is an array like ['ctrl+k', 'c']
          // => `shortcutsStr` = 'ctrl+k c'
          // => when usage is like `Mousetrap.bind(['ctrl+k c'])`
          const shortcutsStr = sequence.join(' ')
          // check is validate
          const mod = /Mac|iPod|iPhone|iPad/.test(navigator.platform) ? 'meta' : 'ctrl'
          const isMulti = Object.values(this.shortcuts).flat().map(s => s.replace(/mod/gi, mod)).includes(shortcutsStr)
          if (isMulti) {
            this.$swal.toast.error.fire({
              title: '该快捷键已被占用'
            })
          } else {
            // apply the change
            this.$store.commit('storage/setShortcuts', { shortcutName: key, shortcutsList: [shortcutsStr] })
          }
          end()
        })
      })
    },
    async getProxyArgs () {
      this.proxyArgs = await this.$api.proxyArgs()
    },
    async setProxy () {
      try {
        const resultString = await this.$api.setProxy(this.proxyArgs)
        if (resultString === 'set_success') {
          this.$swal.toast.success.fire('代理设置成功')
        } else { throw new Error('unknown error in setting proxy') }
      } catch (err) {
        this.$swal.toast.error.fire('代理设置失败')
      }
    },
    async networkSpeedTest () {
      this.isNetworkSpeedTest = true
      try {
        let cnt = 4
        const taskStack = Array.from({ length: cnt }).map(
          () => async (rtt) => rtt + (await this.$api.networkSpeedTest({ diversionUrl: this.diversionUrl, token: this.token })).rtt
        )
        const rttTot = await taskStack.reduce((previousPromise, testFunc) => {
          return previousPromise.then(testFunc).catch(() => {
            this.$swal.toast.error.close()
            cnt--
            return previousPromise
          })
        }, Promise.resolve(0))
        this.network.rtt = rttTot / cnt // => number includes NaN
      } catch (err) {}
      this.isNetworkSpeedTest = false
    }
  },
  created () {
    this.getProxyArgs()
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
    div .handle {
      display: inline;
      margin-right: 10px;
      color: @color-font-default-sub;
      cursor: move;
    }
    div .label {
      display: inline;
      font-size: 18px;
      opacity: .78;
    }
    div .display-word {
      margin: 0 10px;
      color: @color-font-default-sub;
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
        color: @color-font-default-sub;
        box-sizing: content-box;
        background-color: transparent;
        outline: none;
        transition: .2s;
        text-align: right;
        &:focus {
          border-bottom: 2px solid @color-line-default;
          color: @color-font-default;
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
    .big-btn {
      display: flex;
      justify-content: center;
      align-items: center;
      flex: 1;
      font-size: 18px;
      padding: 4px 0;
      border: 1px solid @color-font-default-sub;
      cursor: pointer;
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
  .drag-ghost {
    opacity: 0.5;
  }
  .small-tip {
    color: @color-font-default-sub;
  }
}
</style>
