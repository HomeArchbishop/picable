<template>
  <div class="common-tip-block"
    :class="{ hoverable: clickable === true, waiting: waiting === true }"
  >
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'CommonTipBlock',
  props: ['clickable', 'waiting']
}
</script>

<style lang="less" scoped>
@import '~@/assets/themes/config';
@import '~@/assets/themes/@{theme-name}/theme';

.common-tip-block {
  padding: 8px 16px;
  border-radius: .75em;
  background: @background-btn-default;
  width: fit-content;
  user-select: none;
  cursor: default;
  transition: .2s;
  &.hoverable {
    cursor: pointer;
    &:hover {
      transform: scale(110%);
    }
  }
  &.waiting {
    cursor: wait;
  }
}

@keyframes loading {
  0% {
    width: 15px;
    left: 0;
  }
  25% {
    width: 150px;
    left: 0;
  }
  50% {
    width: 15px;
    left: 135px;
  }
  75% {
    width: 150px;
    left: 0;
  }
  100% {
    width: 15px;
    left: 0;
  }
}
</style>
