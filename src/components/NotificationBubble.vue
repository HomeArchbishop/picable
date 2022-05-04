<template>
  <div class="notification-bubble-item">
    <div class="msg-card" v-dompurify-html="item.message.replace(/\n+/g, '<br/>')"></div>
  </div>
</template>

<script>
export default {
  name: 'NotificationBubble',
  props: ['item']
}
</script>

<style lang="less" scoped>
@import '~@/assets/themes/config';
@import '~@/assets/themes/@{theme-name}/theme';
.notification-bubble-item {
  border-left: 5px solid @color-line-default-highlight;
  animation: stretch .4s ease-in;
  .msg-card {
    font-weight: 300;
    background: fade(@background-btn-highlight, 10%);
    width: 90%;
    padding: 8px 8px;
    margin: 20px 0;
    overflow: hidden;
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
</style>
