<template>
  <div class="login-container">
    <div class="form-box">
      <h1>
        <span class="highlight">登录</span>
        <router-link :to="{ name: 'Register' }" custom v-slot="{ navigate }">
          <span class="sub-link" @click="navigate">去注册</span>
        </router-link>
      </h1>
      <form @submit.prevent="login()">
        <div class="input-div">
          <label>用户名</label>
          <input type="text" v-model.trim="username"
            ref="usernameInput"
            @focusin="isUsernameInputFocused = true"
            @focusout="isUsernameInputFocused = false"
          >
          <div class="account-list" v-if="isShowAccount && rememberWithPasswordList.length"
            @mouseover="isAccountMouseon = true" @mouseout="isAccountMouseon = false"
          >
            <div class="account-item"
              v-for="(item, index) in rememberWithPasswordList" :key="item.username + index"
              @click="useAccount(item.username)"
            >
              {{ item.username }}
            </div>
          </div>
        </div>
        <div class="input-div">
          <label>密&emsp;码</label>
          <input type="password" v-model.trim="password" ref="passwordInput">
        </div>
        <div class="function-div">
          <div class="check-box">
            记住密码
            <check-box small :isChecked="isRememberMe" @click="isRememberMe = !isRememberMe" />
          </div>
          <input type="submit" value="" style="display: none;">
          <div class="submit-btn" @click="login()">
            登录<font-awesome-icon icon="angle-right" />
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { library } from '@fortawesome/fontawesome-svg-core'
import { faAngleRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import CheckBox from '../components/CheckBox.vue'

library.add(faAngleRight)

export default {
  name: 'Login',
  components: {
    FontAwesomeIcon,
    CheckBox
  },
  data () {
    return {
      rememberList: [],
      isRememberMe: false,
      isUsernameInputFocused: false,
      isAccountMouseon: false,
      username: '',
      password: ''
    }
  },
  computed: {
    accountListLeftPadding () {
      return Math.min(Math.max(this.username.length / 2, 5.8), 15) + 'em'
    },
    isShowAccount () {
      return this.isAccountMouseon || this.isUsernameInputFocused
    },
    rememberWithPasswordList () {
      return this.rememberList.filter(o => !!o.password && o.username.startsWith(this.username)).reverse()
    }
  },
  methods: {
    async getRememberList () {
      this.rememberList = await this.$api.getRememberAccount()
    },
    async resolveRememberMe () {
      const meInfo = { username: this.username, password: this.isRememberMe ? this.password : '' }
      const userIndex = this.rememberList.findIndex(o => o.username === this.username)
      // only save 3 accounts
      const nextRememberList = [meInfo, ...this.rememberList.slice(0, userIndex), ...this.rememberList.slice(1 + userIndex)].slice(0, 3)
      await this.$api.updateRememberAccount(nextRememberList)
    },
    async useAccount (username) {
      const targetAccont = this.rememberList.find(o => o.username === username)
      console.log(targetAccont)
      if (!targetAccont) { return }
      this.$refs.passwordInput.focus()
      this.isAccountMouseon = false
      this.username = targetAccont.username
      this.password = targetAccont.password
    },
    async login () {
      // ENTER will submit the form and call this function
      // while the password is empty,
      // so it is necessary to judge the empty, and then handle it

      if (!this.username) {
        this.$refs.usernameInput.focus()
        return
      } else if (!this.password) {
        this.$refs.passwordInput.focus()
        return
      }

      // real login
      this.$utils.showLoadingPica()
      try {
        const nextToken = await this.$api.authorize({
          diversionUrl: this.diversionUrl, username: this.username, password: this.password
        })
        if (nextToken === false) {
          this.$utils.hideLoadingPica()
          this.$swal.toast.error.fire({
            title: '账号或密码错误'
          })
          return
        }
        await this.resolveRememberMe()
        this.$store.commit('storage/setToken', { nextToken })
        this.$router.push({ name: 'Home' })
        // hide loading-pica animation
        this.$utils.hideLoadingPica()
      } catch {
        this.$utils.hideLoadingPica()
      }
    }
  },
  watch: {
    username (newName) {
      this.isRememberMe = this.rememberList.some(o => o.username === newName && !!o.password)
    }
  },
  created () {
    this.getRememberList().then(() => {
      this.isRememberMe = !!this.rememberList[0]?.password
      this.username = this.rememberList[0]?.username || ''
      this.password = this.rememberList[0]?.password || ''
    })
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/themes/config';
@import '~@/assets/themes/@{theme-name}/theme';
.login-container {
  display: flex;
  flex: 1;
  height: 80vh;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.form-box {
  display: flex;
  flex-direction: column;
  .highlight {
    width: 100%;
    text-align: left;
    color: @color-font-default-highlight;
  }
  .sub-link {
    font-size: .5em;
    margin-left: 1em;
    opacity: .4;
    cursor: pointer;
    transition: .2s;
    &:hover {
      text-decoration: underline;
      opacity: .9;
    }
  }
  .input-div {
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    margin-bottom: 10px;
    width: 400px;
    height: 40px;
    position: relative;
    label {
      margin-right: 8px;
      font-size: 18px;
      opacity: .78;
    }
    input {
      display: block;
      flex: 1;
      padding: 0 5px;
      font-size: 20px;
      padding: 0 5px;
      font-size: 18px;
      font-family: inherit;
      border: none;
      border-bottom: 2px solid @color-line-default-sub;
      box-sizing: content-box;
      background-color: transparent;
      outline: none;
      transition: .2s;
      &:focus {
        border-bottom: 2px solid @color-line-default;
      }
    }
    .account-list {
      padding: 0;
      overflow: hidden;
      box-shadow: @shadow-card-default;
      background: @background-main;
      border-radius: .3em;
      position: absolute;
      left: v-bind(accountListLeftPadding);
      right: calc(100% - v-bind(accountListLeftPadding) - 17em);
      bottom: 100%;
      z-index: 10;
      .account-item {
        width: 100%;
        padding: 1em 1.5em;
        cursor: pointer;
        transition: .2s;
        &:hover {
          background: lighten(@background-btn-highlight, 25%);
        }
      }
    }
  }
  .function-div {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 400px;
    height: 40px;
    margin-top: 20px;
    .check-box {
      display: flex;
      color: @color-font-default-sub;
    }
    .submit-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 100px;
      height: 40px;
      padding: 2px 1px 2px 5px;
      font-size: 20px;
      // border: 2px solid @color-line-default;
      border: none;
      background-color: transparent;
      outline: none;
      cursor: pointer;
      border-radius: .75em;
      transition: .2s;
      background-color: lighten(@background-btn-default, 20%);
      &:hover {
        transform: scale(110%);
        background-color: @background-btn-default;
      }
    }
  }
}
</style>
