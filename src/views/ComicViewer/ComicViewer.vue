<template>
  <div class="comic-viewer-container">
    <column-scroll v-if="viewDirection === 'column-scroll'" @showSubViewSetting="isShowSubViewSetting = true" />
    <row-scroll v-if="viewDirection === 'row-scroll'" @showSubViewSetting="isShowSubViewSetting = true" />
    <row-slide v-if="viewDirection === 'row-slide'" @showSubViewSetting="isShowSubViewSetting = true" />
    <sub-view-setting v-if="isShowSubViewSetting" @hideSubViewSetting="isShowSubViewSetting = false" />
  </div>
</template>

<script>
import ColumnScroll from './ColumnScroll.vue'
import RowScroll from './RowScroll.vue'
import RowSlide from './RowSlide.vue'
import { mapState } from 'vuex'
import SubViewSetting from '../../components/SubViewSetting.vue'

export default {
  name: 'ComicViewer',
  components: {
    ColumnScroll,
    RowScroll,
    RowSlide,
    SubViewSetting
  },
  data () {
    return {
      isShowSubViewSetting: false
    }
  },
  computed: {
    ...mapState({
      viewDirection: state => state.storage.imgViewerSettings.direction || 'column-scroll'
    })
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/themes/config';
@import '~@/assets/themes/@{theme-name}/theme';

</style>
