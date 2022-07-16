<template>
<div class="download-item">
  <div class="comic-info">
    <div class="title">{{ comicDetail.title }}</div>
    <div class="info-layer">
      <div class="info" v-if="comicDetail.author">作者：{{ comicDetail.author }}</div>
      <div class="info" v-if="comicDetail.chineseTeam">汉化：{{ comicDetail.chineseTeam }}</div>
    </div>
  </div>
  <div class="epi-info">
    <div class="epi-item"
      v-for="epiItem in epiList"
      :key="comicDetail._id + epiItem.info.comicDetail.episodesOrder"
    >
      <div class="title">
        <div class="name ellipsis"
          @click="(e) => e.target.classList.remove('ellipsis')"
        >{{ epiItem.info.comicDetail.episodesTitle }}</div>
        <div class="info" v-if="epiItem.state === 'success'">
          {{ epiItem.info.pictureInfoList.length }}页全
        </div>
        <div class="info" v-if="epiItem.state === 'downloading'">
          已下载
          {{ Object.values(epiItem.refer).filter(({ state }) => state === 'success').length }} /
          {{ epiItem.info.pictureInfoList.length }} 页
        </div>
        <div class="info" v-if="epiItem.state === 'error'">
          成功{{ Object.values(epiItem.refer).filter(({ state }) => state === 'success').length }}页
          失败{{ Object.values(epiItem.refer).filter(({ state }) => state !== 'success').length }}页
          总{{ epiItem.info.pictureInfoList.length }}页
        </div>
      </div>
      <div class="state" v-if="epiItem.state === 'success'">已完成</div>
      <div class="state" v-if="epiItem.state === 'downloading'">正在下载</div>
      <div class="state" v-if="epiItem.state === 'cancelled'">已取消</div>
      <div class="state" v-if="epiItem.state === 'error'">部分失败</div>
      <div class="func-bar">
        <div class="btn"
          v-if="epiItem.state === 'success'"
          @click="packPDF(epiItem.info.comicDetail.episodesOrder)"
        >
          保存pdf
        </div>
        <div class="btn"
          v-if="epiItem.state === 'success'"
          @click="packZIP(epiItem.info.comicDetail.episodesOrder)"
        >保存zip</div>
        <div class="btn" v-if="epiItem.state === 'success'">删除</div>
        <div class="btn" v-if="epiItem.state === 'downloading'">取消</div>
        <div class="btn" v-if="epiItem.state === 'cancelled'">重新下载</div>
        <div class="btn" v-if="epiItem.state === 'error'">重试</div>
        <div class="btn" v-if="epiItem.state === 'error'">取消</div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'DownloadItemLarge',
  props: {
    epiList: {
      type: Array,
      required: true
    }
  },
  computed: {
    comicDetail () {
      return this.epiList[0].info.comicDetail
    }
  },
  methods: {
    async packPDF (episodesOrder) {
      this.$swal.modal.fire({
        title: '正在打包为PDF...',
        html: this.comicDetail.title + '<br>' + this.comicDetail.episodesTitle,
        showCancelButton: false,
        showConfirmButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
        willOpen: () => {
          this.$swal.modal.showLoading()
          this.$swal.modal.clickConfirm()
        },
        preConfirm: () => {
          // Promise<'save_success' | 'save_cancelled' | 'save_error'>
          return this.$api.packPDF({ comicId: this.comicDetail._id, episodesOrder })
        }
      }).then((result) => {
        console.log(result.value)
        if (result.value === 'save_success') {
          this.$swal.toast.success.fire('PDF保存成功')
        } else if (result.value === 'save_error') {
          this.$swal.toast.error.fire('PDF保存失败')
        }
      }).catch(() => null)
    },
    async packZIP (episodesOrder) {
      this.$swal.modal.fire({
        title: '正在打包为ZIP...',
        html: this.comicDetail.title + '<br>' + this.comicDetail.episodesTitle,
        showCancelButton: false,
        showConfirmButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
        willOpen: () => {
          this.$swal.modal.showLoading()
          this.$swal.modal.clickConfirm()
        },
        preConfirm: () => {
          // Promise<'save_success' | 'save_cancelled' | 'save_error'>
          return this.$api.packZIP({ comicId: this.comicDetail._id, episodesOrder })
        }
      }).then((result) => {
        console.log(result.value)
        if (result.value === 'save_success') {
          this.$swal.toast.success.fire('ZIP保存成功')
        } else if (result.value === 'save_error') {
          this.$swal.toast.error.fire('ZIP保存失败')
        }
      }).catch(() => null)
    },
    async cancelDownloadComic (episodesOrder) {
      this.$swal.modal.fire({
        title: '正在取消下载...',
        html: this.comicDetail.title + '<br>' + this.comicDetail.episodesTitle,
        showCancelButton: false,
        showConfirmButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
        willOpen: () => {
          this.$swal.modal.showLoading()
          this.$swal.modal.clickConfirm()
        },
        preConfirm: () => {
          // Promise<'save_success' | 'save_cancelled' | 'save_error'>
          return this.$api.cancelDownloadComic({ comicId: this.comicDetail._id, episodesOrder })
        }
      }).then((result) => {
        console.log(result.value)
        if (result.value === 'cancel_success') {
          this.$swal.toast.success.fire('取消成功')
        } else if (result.value === 'cancel_error') {
          this.$swal.toast.error.fire('可能发生了错误')
        }
      }).catch(() => null)
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/themes/config';
@import '~@/assets/themes/@{theme-name}/theme';
.download-item {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 18px 0;
  padding: 10px 18px;
  box-shadow: @shadow-card-default;
  border-radius: .75em;
  font-weight: 300;
  overflow: hidden;
  transition: .2s;
  .comic-info {
    .title {
      font-size: 18px;
      font-weight: normal;
    }
    .info-layer {
      display: flex;
      flex-direction: row;
      align-items: baseline;
      flex-wrap: wrap;
      .info {
        font-size: .8em;
        color: @color-font-default-sub;
        margin-right: .7em;
      }
    }
  }
  .epi-info {
    margin-top: 16px;
    .epi-item {
      display: grid;
      grid-template-columns: 40% 15% 45%;
      align-items: center;
      border-bottom: 1px solid #dadada;
      border-top: 1px solid #dadada;
      padding: 6px 0;
      .title {
        margin-right: 20px;
        .name {
          font-size: .97em;
          &.ellipsis {
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            cursor: default;
          }
        }
        .info {
          font-size: .8em;
          color: @color-font-default-sub;
        }
      }
      .state {
        text-align: center;
        font-size: .97em;
        white-space: nowrap;
        color: @color-font-default-sub;
      }
      .func-bar {
        display: flex;
        justify-content: flex-end;
        .btn {
          font-size: .9em;
          padding: 4px 10px;
          white-space: nowrap;
          border: 1px solid #dadada;
          cursor: pointer;
          transition: .2s;
          user-select: none;
          &:hover {
            background: lighten(@background-btn-highlight, 20%);
            border-color: lighten(@background-btn-highlight, 20%);
          }
        }
      }
    }
  }
}
</style>
