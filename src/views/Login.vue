<template>
  <div class="login-container">
    <div class="form-box">
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
          <router-link to="/register" custom v-slot="{ navigate }">
            <div class="sub-link" @click="navigate">去注册</div>
          </router-link>
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
import swal from 'sweetalert'

library.add(faAngleRight)

export default {
  name: 'Login',
  components: {
    FontAwesomeIcon
  },
  data () {
    return {
      isUsernameInputFocused: false,
      isPasswordInputFocused: false,
      username: localStorage.username || '',
      password: localStorage.password || ''
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
          swal({
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
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
    width: 400px;
    height: 40px;
    margin-top: 20px;
    .sub-link {
      font-size: 16px;
      margin-top: 8px;
      cursor: pointer;
    }
    .submit-btn {
      display: flex;
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

      &:hover {
        transform: scale(110%);
      }
      .hoverable-btn()
    }
  }
}
</style>
