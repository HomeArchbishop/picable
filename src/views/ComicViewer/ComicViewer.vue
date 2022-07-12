<template>
  <div class="comic-viewer-container">
    <column-scroll v-if="viewDirection === 'column-scroll'" @showSubViewSetting="isShowSubViewSetting = true" />
    <row-scroll v-if="viewDirection === 'row-scroll'" @showSubViewSetting="isShowSubViewSetting = true" />
    <row-slide v-if="viewDirection === 'row-slide'" @showSubViewSetting="isShowSubViewSetting = true" />
    <sub-view
      view-name="设置"
      title-highlight
      v-if="isShowSubViewSetting"
      @hide="isShowSubViewSetting = false"
    >
      <setting-view is-in-sub-view />
      <small class="small-tip">【注】更多设置，请前往软件的设置页面</small>
    </sub-view>
  </div>
</template>

<script>
import ColumnScroll from './ColumnScroll.vue'
import RowScroll from './RowScroll.vue'
import RowSlide from './RowSlide.vue'
import { mapState } from 'vuex'
import SubView from '../../components/SubView.vue'
import SettingView from '../Setting.vue'

export default {
  name: 'ComicViewer',
  components: {
    ColumnScroll,
    RowScroll,
    RowSlide,
    SubView,
    SettingView
  },
  data () {
    return {
      isShowSubViewSetting: false
    }
  },
  computed: {
    ...mapState({
      viewDirection: state => state.storage.imgViewerSettings.direction || 'column-scroll'
    }),
    comicId () {
      return this.$route.params.comicId
    }
  },
  mounted () {
    this.$api.recordRecentComic(this.comicId)
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/themes/config';
@import '~@/assets/themes/@{theme-name}/theme';

.small-tip {
  color: @color-font-default-sub;
}
</style>
