<template>
  <div class="user-container">
    <div v-if="!isRequestingPersonInfo">
      <div class="name-card">
        <div class="line">
          <div class="left-part">
            <radial-progress-bar :diameter="111"
              :strokeWidth="10"
              :innerStrokeWidth="6"
              :completed-steps="+personInfo.exp % 300 + 1"
              :total-steps="301"
              startColor="#d66e9e"
              stopColor="#d66e9e88"
              innerStrokeColor="#00000006"
            >
              <img :src="avatarSrc" :alt="personInfo.name" v-if="avatarSrc" @click="$utils.viewLargeImage(avatarSrc)">
            </radial-progress-bar>
            <div class="info">
              <div class="username">{{ personInfo.name }}</div>
              <div class="sub-info">
                <font-awesome-icon :icon="{ m: 'mars', f: 'venus', bot: 'robot' }[personInfo.gender]"
                  v-if="['m', 'f', 'bot'].includes(personInfo.gender)" class="gender-badge"
                />
                {{ dobToAge(personInfo.birthday)  }}岁
                &emsp;Lv{{ level }} [{{ personInfo.title }}]
              </div>
            </div>
          </div>
          <div class="right-part">
            <div role="button" class="punch-btn" :class="{ inactive: personInfo.isPunched }" @click="punch">
              <font-awesome-icon :icon="personInfo.isPunched ? 'check' : 'feather'" />
              <span v-if="personInfo.isPunched">已</span>签到
            </div>
          </div>
        </div>
        <div class="line">
          <div>
            <sup><font-awesome-icon icon="quote-left" /></sup>
            <span class="slogan">{{ personInfo.slogan }}</span>
            <sub><font-awesome-icon icon="quote-right" /></sub>
          </div>
        </div>
      </div>
      <div class="info-item">
        <div>
          <div class="label">账号</div>
        </div>
        <div>{{ personInfo.email }}</div>
      </div>
      <div class="info-item">
        <div>
          <div class="label">注册时间</div>
        </div>
        <div>{{ $utils.getCalendarTime(personInfo.created_at) }}</div>
      </div>
      <div class="info-item">
        <div>
          <div class="label">生日</div>
        </div>
        <div>{{ $utils.getDate(personInfo.birthday) }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { library } from '@fortawesome/fontawesome-svg-core'
import { faMars, faVenus, faRobot, faFeather, faCheck, faQuoteLeft, faQuoteRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import dobToAge from 'dob-to-age'
import swal from 'sweetalert'
import RadialProgressBar from 'vue-radial-progress'

library.add(faMars, faVenus, faRobot, faFeather, faCheck, faQuoteLeft, faQuoteRight)

export default {
  name: 'User',
  components: {
    FontAwesomeIcon,
    RadialProgressBar
  },
  data () {
    return {
      isRequestingPersonInfo: false,
      isRequestingMyComments: true,
      isRequestingPunch: false,
      personInfo: {},
      myCommentsList: [],
      myCommentsCurrentPage: 1,
      isFoundAny: true,
      isAll: false
    }
  },
  computed: {
    avatarSrc () {
      return this.personInfo.avatar
        ? this.$utils.formatImgUrl(this.personInfo.avatar.fileServer, this.personInfo.avatar.path)
        : '../../static/img/black.jpeg'
    },
    level () {
      return Math.max(+this.personInfo.level, ~~(+this.personInfo.exp / 300) + 1)
    }
  },
  methods: {
    dobToAge,
    getPersonInfo: async function () {
      // change state.
      this.isRequestingPersonInfo = true
      // call api.
      const personInfo = await this.$api.personInfo({
        diversionUrl: this.diversionUrl, token: this.token
      })
      this.personInfo = personInfo
      console.log(personInfo)
      // change state.
      this.isRequestingPersonInfo = false
    },
    updateMyCommentsPage: async function () {
      // change state.
      this.$set(this, 'isRequestingMyComments', true)
      // call api.
      const myCommentsList = await this.$api.myComments(this.token, this.myCommentsCurrentPage)
      this.myCommentsList.push(...myCommentsList.docs)
      console.log(myCommentsList)
      // change state.
      this.$set(this, 'isRequestingMyComments', false)
      // judge if empty.
      if (!myCommentsList.pages) {
        this.$set(this, 'isFoundAny', false)
      }
      // judge if is all, if not, then pageCount++.
      if (+myCommentsList.page === +myCommentsList.pages) {
        this.$set(this, 'isAll', true)
      } else {
        this.$set(this, 'myCommentsCurrentPage', this.myCommentsCurrentPage + 1)
      }
    },
    refreshMyComments: async function () {
      this.$set(this, 'myCommentsCurrentPage', 1)
      this.$set(this, 'myCommentsList', [])
      this.updateMyCommentsPage()
    },
    punch: async function () {
      if (this.personInfo.isPunched || this.isRequestingPunch) { return }
      // change state.
      this.isRequestingPunch = true
      // call api.
      const punchActionRes = await this.$api.punch({
        diversionUrl: this.diversionUrl, token: this.token
      })
      console.log(punchActionRes)
      // judge.
      const preLevel = this.level
      if (punchActionRes.status === 'ok') {
        this.personInfo.isPunched = true
        this.personInfo.exp += 10
      } else /* punchActionRes.status === 'fail' */ {
        swal({
          title: '哔咔被玩坏了',
          text: '签到失败。请重试...'
        })
      }
      this.personInfo.exp += 10
      if (this.level === preLevel + 1) {
        swal({
          title: '恭喜升级',
          timer: 2000
        })
      }
      // change state.
      this.isRequestingPunch = false
    },
    logout: async function () {
      localStorage.token = ''
      this.$router.push({ name: 'LoginView' })
    }
  },
  created () {
    this.getPersonInfo()
    // this.updateMyCommentsPage()
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/themes/config';
@import '~@/assets/themes/@{theme-name}/theme';
.user-container {
  .name-card {
    width: 100%;
    padding: 6px 18px;
    border-radius: 16px;
    background: lighten(@background-btn-default, 30%);
    // box-shadow: @shadow-card-default;
    .line {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      margin: 14px 0;
      .left-part {
        display: flex;
        flex-direction: row;
        align-items: center;
        img {
          height: 90px;
          width: 90px;
          border: none;
          border-radius: 90px;
        }
        .info {
          display: flex;
          flex-direction: column;
          margin-left: 20px;
          .username {
            font-size: 26px;
            font-weight: 600;
            margin-bottom: 2px;
          }
          .sub-info {
            display: flex;
            flex-direction: row;
            .gender-badge {
              margin-right: 4px;
            }
          }
        }
      }
      .right-part {
        display: flex;
        flex-direction: row;
        align-items: center;
        .punch-btn {
          font-size: 18px;
          font-weight: 600;
          text-decoration: none;
          border-radius: .75em;
          padding: 8px 12px;
          opacity: .68;
          margin-right: 12px;
          transition: .2s;
          cursor: pointer;
          &:not(.inactive):hover {
            background-color: @background-btn-default;
            color: @background-btn-highlight;
          }
          &.inactive {
            color: @background-btn-highlight;
            cursor: default;
          }
        }
      }
      div .slogan {
        margin: 0 6px;
        opacity: .78;
      }
    }
  }
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
  }
}
</style>
