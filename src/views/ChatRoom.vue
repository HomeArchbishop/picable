<template>
  <div class="chat-room-container">
    <div class="display-card">
      <div class="msg-show-field-ctner">
        <div class="ws-state-tip">
          <div class="tip" v-if="wsState === 'closed'">
            <span class="red-tag"></span>
            <span>已断开</span>
            <span class="btn" @click="connectWS()">点击重连</span>
          </div>
          <div class="tip" v-else-if="wsState === 'connecting'">
            <span class="green-tag"></span>
            <span>正在连接...</span>
          </div>
          <div class="tip" v-else-if="wsState === 'connected'">
            <span class="green-tag"></span>
            <span>已连接</span>
            <span v-if="!Number.isNaN(connectCnt)">人数：{{ connectCnt }}</span>
          </div>
        </div>
        <div class="unread-msg-tip" v-if="unreadMsgCnt"
          @click="scrollMsgFieldBottom()"
        >{{ unreadMsgCnt }}新消息<font-awesome-icon icon="angle-down" /></div>
        <div class="msg-show-field" ref="msgField" @scroll="msgFieldScrollHandler">
          <div class="row-group" v-for="([msgType, item], index) in msgList" :key="index">
            <msg-bubble
              v-if="msgType !== 'receive_notification' && msgType !== 'broadcast_ads' && msgType !== 'my_message'"
              :item="item" @add-reply="setReply" @add-at="setAt"
            />
            <msg-bubble
              v-if="msgType === 'my_message'" :ismymsg="true" :item="item"
              @add-reply="setReply" @add-at="setAt"
            />
            <notification-bubble v-if="msgType === 'receive_notification'" :item="item" />
          </div>
        </div>
      </div>
      <div class="input-field">
        <div class="state-row" v-if="hasInputState">
          <span class="state-tip-item" v-if="this.at">
            <font-awesome-icon icon="at" />
            {{ this.at.name.slice(0, 6) }}{{ this.at.name.slice(6) ? '...' : '' }}
            <span class="cross" @click="setAt()">+</span>
          </span>
          <span class="state-tip-item" v-if="this.reply">
            <font-awesome-icon icon="reply" />
            {{ this.reply.name.slice(0, 6) }}{{ this.reply.name.slice(6) ? '...' : '' }}
            <span class="cross" @click="setReply()">+</span>
          </span>
        </div>
        <textarea
          class="text-textarea" v-model="textInput"
          @keydown="textInputKeyDown"
          placeholder="「ctrl+Enter」发送。暂不支持图片"
        ></textarea>
      </div>
    </div>
  </div>
</template>

<script>
import MsgBubble from '../components/MsgBubble'
import NotificationBubble from '../components/NotificationBubble'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faAngleDown, faReply, faAt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { ChatRoomWS } from '../assets/js/ChatRoomWS'
import { black } from '../assets/img/black'
import deepcopy from 'deepcopy'

library.add(faAngleDown, faReply, faAt)

export default {
  name: 'ChatRoom',
  components: { FontAwesomeIcon, MsgBubble, NotificationBubble },
  props: ['url', 'chatname'],
  data () {
    return {
      chatRoomWS: undefined,
      heartbeat: undefined,
      msgList: [],
      wsState: 'connecting',
      unreadMsgCnt: 0,
      connectCnt: NaN,
      textInput: '',
      userInfo: undefined,
      reply: undefined,
      at: undefined,
      diyLevel: 0,
      diyTitle: '',
      diyReg: /(?<=\[picable\s+).+?=.*?(?=\])/g,
      diyReplaceReg: /\[picable\s+.+?=.*?\]/g
    }
  },
  computed: {
    hasInputState () { return this.reply || this.at }
  },
  methods: {
    async connectWS () {
      this.wsState = 'connecting'
      if (ChatRoomWS.isChatRoomWS(this.chatRoomWS)) {
        this.closeWS()
      }
      this.chatRoomWS = new ChatRoomWS(this.url)
      this.startWSListener()
    },
    async closeWS () {
      this.chatRoomWS.close()
      this.clearHeartbeat()
    },
    async startWSListener () {
      this.chatRoomWS.on('open', this.wsOpenHandler)
      this.chatRoomWS.on('message', this.wsMessageHandler)
      this.chatRoomWS.on('error', this.wsErrorHandler)
      this.chatRoomWS.on('close', this.wsCloseHandler)
    },
    async startHeartbeat (interval) {
      this.heartbeat = setInterval(() => this.chatRoomWS.send('2'), interval)
    },
    async clearHeartbeat () {
      clearInterval(this.heartbeat)
    },
    async wsOpenHandler () {
      this.wsState = 'connected'
      this.initRoom()
    },
    async wsMessageHandler ({ data }) {
      // the msgNumStr is formed as:
      // {
      //   "0": "开始",
      //   "40": "链接",
      //   "2": "发送出去的ping",
      //   "3": "pong",
      //   "42": "message"
      // }
      // console.log(data)
      const dataStr = data.toString()
      let msgNumStr = ''
      let msgObjStr = dataStr
      while ((/\d/).test(msgObjStr.at(0))) {
        msgNumStr += msgObjStr.at(0)
        msgObjStr = msgObjStr.slice(1)
      }
      const msgObj = msgObjStr ? JSON.parse(msgObjStr) : undefined
      switch (msgNumStr) {
        case '0':
          this.startHeartbeat(msgObj.pingInterval || 25000)
          break
        case '40':
          console.log('pica res:40 (ok)')
          break
        case '41':
          console.log('pica res:42 (inited)')
          break
        case '3':
          console.log('pica res:3 (pong)')
          break
        case '42':
          if (msgObj[0] === 'kick') { break } else if (msgObj[0] === 'new_connection') {
            this.connectCnt = msgObj[1].connections
            break
          } else if (msgObj[0] !== 'broadcast_ads') {
            this.msgList.push(msgObj)
          } else {
            console.log('ads blocked.')
          }
          console.log(msgObj[1].message, msgObj)
          break
        default:
          console.log('newMsgNumStr', msgNumStr)
      }
    },
    async wsErrorHandler (e) {
      console.log('ws error')
    },
    async wsCloseHandler () {
      this.wsState = 'closed'
      this.clearHeartbeat()
      console.log('ws closed')
    },
    async initRoom () {
      try {
        this.userInfo = await this.$api.personInfo({ diversionUrl: this.diversionUrl, token: this.token })
      } catch (err) {
        this.$compHelper.breakdown.call(this)
      }
      this.chatRoomWS.send(`42${JSON.stringify(['init', this.userInfo])}`)
    },
    async textInputKeyDown (e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault()
        this.sendMsg()
        return false
      }
    },
    async sendMsg () {
      await this.sendTextMsg()
    },
    async sendTextMsg () {
      if (this.textInput.match(this.diyReg)) {
        await this.setDiy()
        this.textInput = this.textInput.replace(this.diyReplaceReg, '')
      }
      if (!this.textInput) { return }
      if (!this.userInfo) { return }
      console.log('send text')
      const info = deepcopy(this.userInfo)
      info.avatar = info.avatar ? `https://storage.wikawika.xyz/static/${info.avatar.path}` : black
      info.avatar = black
      info.audio = info.block_user_id = info.reply_name = info.at = info.reply = ''
      info.platform = 'android'
      info.message = this.textInput
      info.level = this.diyLevel ? this.diyLevel : info.level
      info.title = this.diyTitle ? this.diyTitle : info.title
      if (this.at) {
        info.at = '嗶咔_' + this.at.name
        if ((/@悄悄话/).test(this.textInput)) {
          info.block_user_id = this.at.user_id
        }
      }
      if (this.reply) {
        info.reply = this.reply.message
        info.reply_name = this.reply.name
      }
      this.chatRoomWS.send(`42${JSON.stringify(['send_message', info])}`)
      this.msgList.push(['my_message', info])
      this.textInput = ''
      this.reply = this.at = undefined
      this.scrollMsgFieldBottom()
    },
    async setReply (obj) {
      console.log(obj)
      this.reply = obj
    },
    async setAt (obj) {
      console.log(obj)
      this.at = obj
    },
    async setDiy () {
      this.textInput.match(this.diyReg).map(l => l.replace(/\s/g, '')).forEach(line => {
        const variablesMatch = line.match(/^.+(?==)/)
        const valueMatch = line.match(/(?<==).+$/)
        console.log(line, variablesMatch, valueMatch)
        if (variablesMatch && variablesMatch[0] === 'title') { this.diyTitle = String(valueMatch ? valueMatch[0] : '') }
        if (variablesMatch && variablesMatch[0] === 'level') { this.diyLevel = Number(valueMatch ? valueMatch[0] : 0) }
      })
    },
    scrollMsgField (h) {
      if (h === undefined) { return }
      this.$refs.msgField.scrollTop = h
    },
    scrollMsgFieldBottom () {
      this.scrollMsgField(this.$refs.msgField.scrollHeight)
    },
    msgFieldScrollHandler ({ target }) {
      if (target.scrollTop + target.offsetHeight === target.scrollHeight) {
        this.unreadMsgCnt = 0
      }
    }
  },
  watch: {
    'msgList.length': {
      handler (nextLength, formerLength) {
        // handle the scroll
        const isMsgFieldAtScrollBottom = this.$refs.msgField
          ? this.$refs.msgField.scrollTop + this.$refs.msgField.offsetHeight === this.$refs.msgField.scrollHeight
          : true
        if (isMsgFieldAtScrollBottom) {
          this.$nextTick(() => {
            this.scrollMsgFieldBottom()
          })
        } else {
          this.unreadMsgCnt += nextLength - formerLength
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted () {
    this.$store.commit('runtime/setWindowTitle', { nextTitle: this.chatname })
    this.connectWS()
    // this.msgList.push(...require('../assets/js/wsFakeData').fakeData)
  },
  beforeUnmount () {
    this.closeWS()
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/themes/config';
@import '~@/assets/themes/@{theme-name}/theme';
.chat-room-container {
  margin-top: -30px;

  .display-card {
    display: grid;
    grid-template-rows: auto 80px;
    height: calc(100vh - 80px);
    width: 100%;
    font-size: .9em;
    .msg-show-field-ctner {
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      overflow: auto;
      position: relative;
      .ws-state-tip {
        width: fit-content;
        position: absolute;
        right: 0;
        top: 1em;
        cursor: default;
        user-select: none;
        opacity: .6;
        .tip {
          display: flex;
          flex-direction: row;
          align-items: center;
          span {
            margin-inline-start: 5px;
          }
          .btn {
            color: @color-font-default-highlight;
            cursor: pointer;
            &:hover {
              text-decoration: underline;
            }
          }
          .green-tag,
          .red-tag,
          .yellow-tag {
            display: inline-block;
            width: .7em;
            height: .7em;
            border-radius: 1em;
            &.green-tag {
              background: green;
            }
            &.red-tag {
              background: red;
            }
            &.yellow-tag {
              background: gold;
            }
          }
        }
      }
      .unread-msg-tip {
        width: 10em;
        padding: .3em 0;
        text-align: center;
        border-radius: 2em;
        background: fade(@background-btn-highlight, 40%);
        position: absolute;
        right: 0;
        bottom: 0;
        cursor: pointer;
        opacity: .8;
      }
      .msg-show-field {
        // background: red;
        max-height: 100%;
        overflow-y: scroll;
        overflow-x: hidden;
        .row-group {
          width: 100%;
        }
        &::-webkit-scrollbar {
          display: none;
        }
      }
    }
    .input-field {
      // background: blue;
      display: flex;
      flex-direction: column;
      border-top: 1px solid @color-line-default-sub;
      padding-top: 5px;
      .state-row {
        .state-tip-item {
          height: 30px;
          border-radius: 20px;
          background: fade(@background-btn-highlight, 30%);
          padding: 0 20px;
          margin-right: 10px;
          user-select: none;
          cursor: default;
          .cross {
            display: inline-block;
            font-size: 1.3em;
            transform: rotateZ(45deg);
            cursor: pointer;
          }
        }
      }
      .text-textarea {
        flex: 1;
        font-size: unset;
        font-family: inherit;
        font-weight: 300;
        border: none;
        outline: none;
        width: 90%;
        background: transparent;
        resize: none;
      }
    }
    .tip-layer {
      display: flex;
      flex-direction: row;
      justify-content: center;
      margin-top: 10px;
    }
  }
}
</style>
