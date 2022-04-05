<template>
  <div class="toggle-switch" :class="{ 'toggle-switch-on': isChecked }" :isChecked="isChecked"></div>
</template>

<script>
export default {
  name: 'ToggleButton',
  props: {
    isChecked: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang='less' scoped>
@import '~@/assets/themes/config';
@import '~@/assets/themes/@{theme-name}/theme';
.toggle-switch {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  position: relative;
  width: 46px;
  height: 26px;
  outline: 0;
  padding: 3px;
  font-size: 18px;
  border-radius: 26px;
  background-color: @background-btn-default;
  transition: background-color 100ms;
  cursor: pointer;
  user-select: none;
  &::after {
    content: '';
    position: absolute;
    top: 3px;
    left: 3px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: #fff;
    transition: transform .2s;
  }
}
.toggle-switch-on {
  background-color: lighten(@background-btn-highlight, 10%);
  &::after {
    transform: translateX(20px);
  }
}
</style>
