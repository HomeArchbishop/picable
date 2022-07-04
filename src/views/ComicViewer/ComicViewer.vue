<template>
  <div class="comic-viewer-container">
    <column-scroll v-if="viewDirection === 'column-scroll'" />
    <row-scroll v-if="viewDirection === 'row-scroll'" />
    <row-slide v-if="viewDirection === 'row-slide'" />
  </div>
</template>

<script>
import ColumnScroll from './ColumnScroll.vue'
import RowScroll from './RowScroll.vue'
import RowSlide from './RowSlide.vue'
import { mapState } from 'vuex'

export default {
  name: 'ComicViewer',
  components: {
    ColumnScroll,
    RowScroll,
    RowSlide
  },
  data () {
    return {
      pictureListDocsList: [],
      pictureLoadingStateMap: {},
      pictureLoadingErrorMap: {},
      pictureLazyLoadHappenedMap: {},
      pictureCurrentInSightList: [0],
      hasNextEpisodes: false,
      nextPage: 1,
      isAll: false,
      isUpdating: false,
      picLinkBtnActiveNum: NaN,
      imgScale: {}
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
