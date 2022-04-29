<template>
  <div class="comment-item" v-if="!item.hide">
    <div class="comment-main">
      <div class="name-row">
        <div>
          <img :src="avatarImg" @click.prevent @click="$utils.viewLargeImage(avatarImg)">
        </div>
        <div class="info-bar">
          <div>
            <div class="name">
              {{ (item._user?.name.substr(0, 20) || '未知用户') + (item._user?.name.slice(20) ? '...' : '') }}
            </div>
            <div v-if="['m', 'f'].includes(item._user?.gender)">&emsp;</div>
            <font-awesome-icon :icon="{ m: 'mars', f: 'venus' }[item._user?.gender]"
              v-if="['m', 'f'].includes(item._user?.gender)" class="gender-badge"
            />
            <span v-if="item._user">&emsp;Lv{{ item._user?.level }} [{{ item._user?.title }}]</span>
          </div>
          <div>{{ createdTime }}</div>
        </div>
      </div>
      <div class="words-row">
        {{ item.content }}
      </div>
    </div>
  </div>

</template>

<script>
import { black } from '../assets/img/black'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faMars, faVenus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faMars, faVenus)

export default {
  name: 'CommentCard',
  components: {
    FontAwesomeIcon
  },
  props: ['commentItem'],
  computed: {
    avatarImg () {
      return this.item._user?.avatar || black
    },
    createdTime () {
      return this.$utils.getCalendarTime(this.item.created_at)
    },
    item: {
      set () {},
      get () {
        return this.commentItem
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/themes/config';
@import '~@/assets/themes/@{theme-name}/theme';
.comment-item {
  .comment-main {
    width: 100%;
    // min-height: 200px;
    padding: 14px 20px;
    margin-top: 10px;
    box-shadow: @shadow-card-default;
    border-radius: .75em;
    position: relative;
    overflow: hidden;
    .name-row {
      display: flex;
      flex-direction: row;
      align-items: center;
      font-size: .7em;
      color: @color-font-default-sub;
      img {
        width: 30px;
        height: 30px;
        border-radius: 30px;
      }
      .info-bar {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        margin-left: 14px;
        .name {
          font-size: 1.1em;
        }
        div {
          display: flex;
          flex-direction: row;
          align-items: baseline;
        }
      }
    }
    .words-row {
      margin-top: .5em;
      text-indent: 2em;
    }
  }
}
</style>
