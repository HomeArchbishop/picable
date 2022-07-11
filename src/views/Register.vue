<template>
  <div class="register-container">
    <div class="form-box">
      <h1>
        <span class="highlight">注册</span>
        <router-link :to="{ name: 'Login' }" custom v-slot="{ navigate }">
          <span class="sub-link" @click="navigate">去登录</span>
        </router-link>
      </h1>
      <form @submit.prevent="register()">
        <div class="input-div">
          <label>用户名</label>
          <input type="text" v-model.trim="registerData.email" ref="emailInput">
        </div>
        <div class="input-div">
          <label>昵&emsp;称</label>
          <input type="text" v-model.trim="registerData.name" ref="nameInput">
        </div>
        <div class="input-div">
          <label>密&emsp;码</label>
          <input type="password" v-model.trim="registerData.password" ref="passwordInput">
        </div>
        <div class="input-div">
          <label>生&emsp;日</label>
          <input type="date" v-model.trim="registerData.birthday" ref="birthdayInput">
        </div>
        <div class="input-div gender-row">
          <check-radio valueStr="m|f|bot" textStr="男|女|保密" @checkChange="changeGender" />
        </div>
        <div class="input-div">
          <label>问题一</label>
          <input type="text" v-model.trim="registerData.question1" ref="question1Input">
        </div>
        <div class="input-div">
          <label>答案一</label>
          <input type="text" v-model.trim="registerData.answer1" ref="answer1Input">
        </div>
        <div class="input-div">
          <label>问题二</label>
          <input type="text" v-model.trim="registerData.question2" ref="question2Input">
        </div>
        <div class="input-div">
          <label>答案二</label>
          <input type="text" v-model.trim="registerData.answer2" ref="answer2Input">
        </div>
        <div class="input-div">
          <label>问题三</label>
          <input type="text" v-model.trim="registerData.question3" ref="question3Input">
        </div>
        <div class="input-div">
          <label>答案三</label>
          <input type="text" v-model.trim="registerData.answer3" ref="answer3Input">
        </div>
        <div class="function-div">
          <div class="submit-btn" @click="register()">
            <input type="submit" value="" style="display: none;">
            注册<font-awesome-icon icon="angle-right" />
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
import CheckRadio from '../components/CheckRadio'
import dobToAge from 'dob-to-age'

library.add(faAngleRight)

export default {
  name: 'Register',
  components: {
    FontAwesomeIcon,
    CheckRadio
  },
  data () {
    return {
      registerData: {
        email: '',
        name: '',
        password: '',
        birthday: '',
        question1: '',
        answer1: '',
        question2: '',
        answer2: '',
        question3: '',
        answer3: '',
        gender: '' // m, f, bot
      }
    }
  },
  methods: {
    async changeGender (nextVal) {
      this.registerData.gender = nextVal
    },
    async register () {
      for (const key in this.registerData) {
        if (!this.registerData[key]) {
          if (key === 'gender') {
            console.log('sss')
            this.$swal.toast.error.fire({
              title: '还没选择性别诶',
              text: '不愿意透露的话可以选「保密」'
            })
          } else {
            this.$swal.toast.error.fire({
              title: '还有字段没有填哦',
              html: '<small style=color:grey;>【注】问题和答案作用暂不明确，反正就是要填</small>'
            })
            this.$refs[`${key}Input`].focus()
          }
          return
        }
      }
      if (dobToAge(this.registerData.birthday) < 18) {
        this.$swal.toast.error.fire({
          title: '未满18周岁',
          text: '成年了再来吧'
        })
        return
      }
      if (this.registerData.password.length < 8) {
        this.$swal.toast.error.fire({
          title: '密码长度应不小于8'
        })
        return
      }
      try {
        const resData = await this.$api.register({
          diversionUrl: this.diversionUrl, data: this.registerData
        })
        if (resData.code === 200) {
          this.$swal.toast.success.fire({
            title: '注册成功',
            html: '即将前往登录<span style="margin-left:5px;cursor:pointer;color:#d66e9e">立即前往</span>',
            timer: 1500,
            didOpen: (toastDom) => {
              toastDom.addEventListener('click', this.$swal.clickConfirm)
            }
          }).then(() => {
            this.$router.push({ name: 'Login' })
          })
        }
      } catch (err) {}
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/themes/config';
@import '~@/assets/themes/@{theme-name}/theme';
.register-container {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  padding-bottom: 20px;
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
    opacity: .78;
    &.gender-row {
      margin-top: 20px;
    }
    label {
      margin-right: 8px;
      font-size: 18px;
    }
    input {
      display: block;
      flex: 1;
      padding: 0 5px;
      font-size: 20px;
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
