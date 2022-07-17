<template>
  <div class="download-container">
    <div class="display-card">
      <div class="menu-area">
        <div class="type-list">
          <div class="type-item"
            @click.stop="changeType('downloaded')"
            :class="{ current: currentType === 'downloaded' }"
          >
            已下载
          </div>
          <div class="type-item"
            @click.stop="changeType('downloading')"
            :class="{ current: currentType === 'downloading' }"
          >
            正在下载<sub class="badge" v-if="downloadingDownloadCnt">{{ downloadingDownloadCnt }}</sub>
          </div>
        </div>
      </div>
      <div class="tip-small">现阶段还不可以在软件内看哦。尝试导出来看吧！</div>
      <div v-if="currentType === 'downloaded'">
        <download-item-large
          v-for="(epiList, comicId) in successDownloadInfo"
          :key="comicId"
          :epiList="epiList"
        />
        <div class="tip-layer">
          <common-tip-block v-if="!successDownloadCnt">什么都没有</common-tip-block>
        </div>
      </div>
      <div v-if="currentType === 'downloading'">
        <download-item-large
          v-for="(epiList, comicId) in downloadingDownloadInfo"
          :key="comicId"
          :epiList="epiList"
        />
        <div class="tip-layer">
          <common-tip-block v-if="!downloadingDownloadCnt">什么都没有</common-tip-block>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DownloadItemLarge from '../components/DownloadItemLarge.vue'
import CommonTipBlock from '../components/CommonTipBlock'
// import LoadingItemLarge from '../components/LoadingItemLarge.vue'

export default {
  name: 'Download',
  // components: { CommonTipBlock, LoadingItemLarge },
  components: {
    DownloadItemLarge, CommonTipBlock
  },
  data () {
    return {
      downloadInfo: {},
      currentType: 'downloaded' // 'downloading' | 'downloaded'
    }
  },
  computed: {
    successDownloadInfo () {
      const successDownloadInfo = {}
      for (const comicId in this.downloadInfo) {
        console.log(comicId)
        for (const epiItem of this.downloadInfo[comicId]) {
          if (epiItem.state === 'success') {
            if (!Array.isArray(successDownloadInfo[comicId])) {
              successDownloadInfo[comicId] = []
            }
            successDownloadInfo[comicId].push({ ...epiItem })
          }
        }
      }
      console.log('successDownloadInfo', successDownloadInfo)
      return successDownloadInfo
    },
    successDownloadCnt () {
      return Object.values(this.successDownloadInfo).reduce((p, c) => p + c.length, 0)
    },
    downloadingDownloadInfo () {
      const downloadingDownloadInfo = {}
      for (const comicId in this.downloadInfo) {
        console.log(comicId)
        for (const epiItem of this.downloadInfo[comicId]) {
          if (epiItem.state !== 'success') {
            if (!Array.isArray(downloadingDownloadInfo[comicId])) {
              downloadingDownloadInfo[comicId] = []
            }
            downloadingDownloadInfo[comicId].push({ ...epiItem })
          }
        }
      }
      console.log('downloadingDownloadInfo', downloadingDownloadInfo)
      return downloadingDownloadInfo
    },
    downloadingDownloadCnt () {
      return Object.values(this.downloadingDownloadInfo).reduce((p, c) => p + c.length, 0)
    }
  },
  methods: {
    async updateDownloadInfo () {
      try {
        // call api to update.
        const downloadTree = await this.$api.downloadTree()
        const downloadInfo = {}
        for (const comicId in downloadTree) {
          downloadTree[comicId].sort((a, b) => +b - +a)
          downloadInfo[comicId] = []
          for (const epiOrder of downloadTree[comicId]) {
            downloadInfo[comicId].push({
              ...await this.$api.downloadEpiState({ comicId, epiOrder })
            })
          }
        }
        console.log(downloadInfo)
        this.downloadInfo = downloadInfo
      } catch (err) {
        this.$swal.toast.error.fire('啊，出错了')
      }
    },
    changeType (type) {
      this.currentType = type
    }
  },
  created () {
    this.updateDownloadInfo()
      .then(() => {
        document.addEventListener('download-state-change', this.updateDownloadInfo)
        document.addEventListener('download-state-change', () => {
          console.log('emit')
        })
      })
  },
  beforeUnmount () {
    document.removeEventListener('download-state-change', this.updateDownloadInfo)
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/themes/config';
@import '~@/assets/themes/@{theme-name}/theme';
.download-container {
  .display-card {
    width: 100%;
    .menu-area {
      width: 100%;
      padding: 15px;
      box-shadow: @shadow-card-default;
      border-radius: .75em;
      .type-list {
        display: flex;
        overflow-x: scroll;
        width: 50%;
        &::-webkit-scrollbar {
          display: none;
        }
        .type-item{
          display: flex;
          min-width: 2em;
          cursor: pointer;
          transition: .2s;
          &:not(:nth-child(1)) {
            margin-left: 10px;
          }
          &:hover {
            color: @color-font-default-highlight;
          }
          &.current {
            cursor: default;
            color: @color-font-default-highlight;
          }
          .badge {
            display: inline-flex;
            justify-content: center;
            align-items: center;
            height: 1.1em;
            padding: 0 4px;
            font-size: .8em;
            border-radius: .7em;
            color: rgb(247, 247, 247);
            background: @color-font-default-highlight;
          }
        }
      }
    }
    .tip-small {
      font-size: small;
      color: @color-font-default-sub;
      margin: 10px 0;
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
