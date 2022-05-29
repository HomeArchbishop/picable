<template>
  <div class="hide-container">
    <div class="content-card">
      <div class="tool-bar">
        <div class="tool-title">目录</div>
      </div>
      <div class="content-item" v-for="title in hiddenPoemTitles" :key="title" @click="changePoem(title)">
        <div class="content-title" :class="{ actived: poemTitle === title }">{{ title }}</div>
        <div class="content-preview">{{ hiddenPoems[title].slice(0, 20) }}...</div>
      </div>
    </div>
    <div class="poem-card">
      <h1>{{ poemTitle }}</h1>
      <div v-html="renderedPoemHtml"></div>
    </div>
  </div>
</template>

<script>
import MarkdownIt from 'markdown-it'
import hiddenPoems from '../assets/text/hiddenPoems'

const md = new MarkdownIt()

export default {
  name: 'HideSecret',
  data () {
    return {
      hiddenPoems,
      hiddenPoemTitles: Object.keys(hiddenPoems)
    }
  },
  computed: {
    poemTitle () {
      return this.$store.state.runtime.currentHiddenPoemTitle
    },
    renderedPoemHtml () {
      return md.render(hiddenPoems[this.poemTitle])
    }
  },
  methods: {
    changePoem (nextTitle) {
      if (this.poemTitle === nextTitle) { return }
      window.scrollTo(0, 0)
      this.$store.commit('runtime/setCurrentHiddenPoemTitle', { nextHiddenPoemTitle: nextTitle })
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/themes/config';
@import '~@/assets/themes/@{theme-name}/theme';

@content-card-width: 20%;
.hide-container {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  .content-card {
    position: fixed;
    top: 110px;
    left: 40px;
    height: calc(100vh - 110px - 30px);
    overflow: scroll;
    ::-webkit-scrollbar {
      display: none;
    }
    width: @content-card-width;
    max-width: 15em;
    .tool-bar {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      color: @color-font-default-sub;
      font-weight: 300;
      font-size: .8em;
      .tool-title {
        cursor: default;
      }
      .tool-btn {
        cursor: pointer;
      }
    }
    .content-item {
      padding: 5px 0;
      border-bottom: 1px solid @color-line-default-sub;
      cursor: pointer;
      .content-title.actived {
        color: @color-font-theme;
      }
      .content-preview {
        color: @color-font-default-sub;
        font-weight: 300;
        font-size: .8em;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
  .poem-card {
    width: calc(100% - @content-card-width - 20px);
  }
  .body-means-p {
    display: block;
    background: #c9c9c9;
    border-radius: 3px;
    padding: 5px 10px;
    margin: 0 -10px;
  }
}
</style>
