<template>
  <div class="bubble-item" :class="{ 'my-msg': ismymsg }">
    <div class="img-div">
      <img
        :src="item.avatar" @click="$utils.viewLargeImage(item.avatar)"
        @error="(e) => e.target.src = black"
      >
    </div>
    <div class="content-div">
      <div class="name-row">
        <div class="name">
          {{ (item.name?.substr(0, 20) || '未知用户') + (item.name?.slice(20) ? '...' : '') }}
        </div>
        <font-awesome-icon :icon="{ m: 'mars', f: 'venus' }[item.gender]"
          v-if="['m', 'f'].includes(item.gender)" class="gender-badge"
        />
        <span class="level">Lv.{{ item.level }} </span>
        <span class="user-title">{{ item.title }}</span>
      </div>
      <div class="words-card">
        <div class="reply" v-if="item.reply">
          <div class="name">{{ item.reply_name }}</div>
          <div class="words">{{ item.reply }}</div>
        </div>
        <div class="main-word">
          <span class="at" v-if="item.at">@{{ item.message.includes('@悄悄话') ? '@悄悄话' : '' }}{{ item.at.replace('嗶咔_', '') }}</span>
          <span class="words" v-dompurify-html="item.message.replace(/\n+/g, '<br/>').replace(/@悄悄话/g, '')"></span>
        </div>
        <div class="msg-image">
          <img v-if="item.image" :src="item.image" alt="加载失败" @click="$utils.viewLargeImage(item.image)">
        </div>
        <!-- <i v-if="item.audio">暂不支持音频文件</i> -->
        <audio controls v-if="item.audio" :src="audioSrc"></audio>
        <div class="details">
          <span class="platform">{{ item.platform }}</span>
          <span class="time">{{ new Date().getHours() }}:{{ new Date().getMinutes() }}</span>
        </div>
        <div class="function-div">
          <div class="function-btn" @click="$emit('add-at', { name: item.name, id: item.user_id })">
            <font-awesome-icon icon="at" />
          </div>
          <div class="function-btn" @click="$emit('add-reply', { name: item.name, message: item.message })">
            <font-awesome-icon icon="reply" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { library } from '@fortawesome/fontawesome-svg-core'
import { faMars, faVenus, faHeart, faReply, faAt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { black } from '../assets/img/black'

library.add(faMars, faVenus, faHeart, faReply, faAt)

export default {
  name: 'MsgBubble',
  components: { FontAwesomeIcon },
  props: ['item', 'ismymsg'],
  data () {
    return {
      black
    }
  },
  computed: {
    audioSrc () {
      if (!this.item.audio) { return '' }
      return 'data:video/3gpp;base64,' + this.item.audio
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/themes/config';
@import '~@/assets/themes/@{theme-name}/theme';
.bubble-item {
  display: flex;
  flex-direction: row;
  width: 90%;
  font-weight: 300;
  margin: 20px 0;
  animation: stretch .4s ease-in;
  .img-div {
    width: 44px;
    height: 44px;
    img {
      height: 44px;
      width: 44px;
      border-radius: 100%;
      border: none;
      cursor: pointer;
    }
  }
  .content-div {
    margin: 0 12px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    .name-row {
      height: 20px;
      font-size: 13px;
      display: flex;
      align-items: flex-end;
      :not(:nth-child(1)) {
        margin-left: 3px;
      }
      .level {
        color: @color-font-default-highlight;
      }
      .user-title {
        background: @color-line-default-highlight-2;
        padding: 4px 8px;
        border-radius: 1em;
        line-height: 1em;
        color: lighten(@color-line-default-sub, 90%);
        font-size: .9em;
      }
    }
    .words-card {
      padding: 10px;
      margin-top: 6px;
      box-shadow: -2px 2px 8px 2px @color-shadow;;
      border-radius: .75em;
      position: relative;
      // min-width: 220px;
      .reply {
        border-left: 5px solid @color-line-default-highlight;
        background: fade(@background-btn-highlight, 5%);
        padding: 3px 8px;
        .name {
          font-size: 13px;
        }
      }
      .main-word {
        .at {
          color: @color-font-default-highlight;
          margin-inline-end: 4px;
        }
      }
      .msg-image {
        text-align: center;
        img {
          max-width: 100%;
          max-height: 200px;
          cursor: pointer;
        }
      }
      .details {
        width: 100%;
        text-align: right;
        color: @color-line-default-sub;
        font-size: 12px;
        margin-top: 5px;
        span {
          margin-left: 8px;
        }
      }
      .function-div {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        position: absolute;
        left: 100%;
        bottom: -2px;
        margin: 0 10px;
        .function-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          color: @color-font-default-sub;
          font-size: .7em;
          background: @background-btn-default;
          height: 20px;
          width: 20px;
          border-radius: 30px;
          margin-top: 4px;
          cursor: pointer;
        }
      }
    }
  }
}

@keyframes stretch {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(0);
  }
}

@keyframes stretch-reverse {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(0);
  }
}

.bubble-item.my-msg {
  flex-direction: row-reverse !important;
  width: 100%;
  animation-name: stretch-reverse;
  .content-div {
    align-items: flex-end;
    .name-row {
      align-items: flex-end;
      flex-direction: row-reverse;
    }
    .words-card {
      .function-div {
        right: 100%;
        left: unset;
      }
    }
  }
}
</style>
