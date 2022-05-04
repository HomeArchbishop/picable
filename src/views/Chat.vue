<template>
  <div class="chat-container">
    <div class="display-card">
      <div v-for="item in chatList" :key="item._id">
        <chat-room-item :item="item" />
      </div>
      <div class="tip-layer">
        <common-tip-block v-if="isUpdating" :waiting="true">正在加载</common-tip-block>
      </div>
    </div>
  </div>
</template>

<script>
import CommonTipBlock from '../components/CommonTipBlock'
import ChatRoomItem from '../components/ChatRoomItem'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
// import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faMagnifyingGlass)

export default {
  name: 'Chat',
  components: { ChatRoomItem, CommonTipBlock /*, FontAwesomeIcon */ },
  data () {
    return {
      isUpdating: true,
      chatList: []
    }
  },
  methods: {
    async updateList () {
      // change states.
      this.isUpdating = true
      // call api to update.
      const chatRoomList = await this.$api.chatRoomList({
        diversionUrl: this.diversionUrl, token: this.token
      })
      this.chatList = chatRoomList.chatList
      console.log(chatRoomList)
      // change states.
      this.isUpdating = false
    }
  },
  created () {
    this.updateList()
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/themes/config';
@import '~@/assets/themes/@{theme-name}/theme';
.chat-container {
  .display-card {
    width: 100%;
    .tip-layer {
      display: flex;
      flex-direction: row;
      justify-content: center;
      margin-top: 10px;
    }
  }
}
</style>
