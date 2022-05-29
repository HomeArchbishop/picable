<template>
  <div class="banned-tag-card">
    <div class="label">分类筛选</div>
    <div class="tool-btn" @click="isShowWrap = !isShowWrap">{{ isShowWrap ? '折叠' : '展开' }}</div>
    <div class="tag-item" :class="{ banned: bannedTagList.includes(tag) }"
      v-for="tag in bannedTagAll" :key="tag" @click="toggleBannedTag(tag)"
      v-show="isShowWrap"
    >{{ tag }}</div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { bannedTagAll } from '../assets/lib/bannedTagAll'

export default {
  name: 'BannedTagCard',
  data () {
    return {
      bannedTagAll,
      isShowWrap: false
    }
  },
  computed: {
    ...mapState({
      bannedTagList: state => state.storage.bannedTags
    })
  },
  methods: {
    toggleBannedTag (tag) {
      this.$store.commit('storage/toggleBannedTag', { tag })
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/themes/config';
@import '~@/assets/themes/@{theme-name}/theme';
.banned-tag-card {
  margin: 10px 0;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  .label,
  .tool-btn {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    margin: 3px 5px;
    color: @color-font-default-sub;
    font-weight: 300;
    font-size: .9em;
    user-select: none;
    &.tool-btn {
      text-decoration: underline;
      cursor: pointer;
    }
  }
  .tag-item {
    display: flex;
    border-radius: .75em;
    border: 1px solid lighten(@background-btn-highlight, 15%);
    background: lighten(@background-btn-highlight, 30%);
    margin: 2px;
    padding: 4px 9px;
    font-size: .83em;
    font-weight: 300;
    line-height: 1em;
    user-select: none;
    cursor: pointer;
    transition: .1s;
    &:nth-last-child(1) {
      margin-right: 0;
    }
    &.banned {
      background: none;
      border-color: @background-btn-default;
    }
    &:hover {
      transform: scale(105%);
      color: lighten(@color-font-default, 20%);
    }
  }
}
</style>
