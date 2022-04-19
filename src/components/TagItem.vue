<template>
<div class="keyword-tag">
  <slot></slot>
</div>
</template>

<style lang="less" scoped>
@import '~@/assets/themes/config';
@import '~@/assets/themes/@{theme-name}/theme';
.keyword-tag {
  display: flex;
  background: @background-btn-default;
  border-radius: .75em;
  margin: 2px;
  padding: 4px 9px;
  font-size: 14px;
  font-weight: 300;
  line-height: 1em;
  cursor: pointer;
  transition: .2s;
  &:nth-last-child(1) {
    margin-right: 0;
  }
  &:hover {
    transform: scale(110%);
    color: lighten(@color-font-default, 20%);
    background: lighten(@background-btn-highlight, 15%);
  }
}
</style>
