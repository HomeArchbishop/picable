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
          <input type="text" v-model.trim="username" ref="usernameInput">
        </div>
        <div class="input-div">
          <label>密&emsp;码</label>
          <input type="password" v-model.trim="password" ref="passwordInput">
        </div>
        <div class="function-div">
          <div class="submit-btn" @click="login()">
            <input type="submit" value="" style="display: none;">
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
import Swal from '../assets/utils/sweetalert-picable'

library.add(faAngleRight)

export default {
  name: 'Login',
  components: {
    FontAwesomeIcon
  },
  data () {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
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
          Swal.fire({
            title: '账号或密码错误',
            icon: 'error'
          })
          return
        }
        this.$store.commit('storage/setToken', { nextToken })
        this.$router.push({ name: 'Home' })
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
  }
  .function-div {
    text-align: right;
    width: 400px;
    height: 40px;
    margin-top: 20px;
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
