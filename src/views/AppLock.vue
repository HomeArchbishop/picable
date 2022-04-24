<template>
  <div class="lock-container">
    <h2>请解锁</h2>
    <div class="form-box">
      <form @submit.prevent="unlockApp()">
        <div class="input-div">
          <input type="password" v-model.trim="password" ref="passwordInput">
        </div>
        <div class="function-div">
          <div class="submit-btn" @click="unlockApp()">
            解锁<font-awesome-icon icon="angle-right" />
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
  name: 'AppLock',
  components: {
    FontAwesomeIcon
  },
  data () {
    return {
      password: ''
    }
  },
  methods: {
    unlockApp () {
      if (this.password === this.$store.state.storage.appLockPassword) {
        this.shiftPage()
      } else {
        swal({
          title: '密码错误',
          icon: 'error'
        }).then(() => {
          this.$refs.passwordInput.focus()
        })
      }
    },
    shiftPage () {
      console.log(this.$route)
      if (!this.$route.meta.from?.name) {
        this.$router.replace({ name: 'Diversion' })
      } else if (this.$route.meta.from.fullPath === this.$route.fullPath || this.$route.meta.from.name === 'Buffer') {
        this.$router.replace({ name: 'Diversion' })
      } else {
        this.$router.replace({ name: this.$route.meta.from.name })
      }
    }
  },
  mounted () {
    this.$refs.passwordInput.focus()
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/themes/config';
@import '~@/assets/themes/@{theme-name}/theme';
.lock-container {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 70vh;
  opacity: .89;
}
.form-box {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  .input-div {
    display: flex;
    flex-direction: row;
    margin-bottom: 10px;
    width: 400px;
    height: 40px;
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
    justify-content: flex-end;
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
