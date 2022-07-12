<template>
  <div class="toggle-switch" :class="{ 'toggle-switch-on': isChecked }" :isChecked="isChecked" :small="small"></div>
</template>

<script>
export default {
  name: 'CheckBox',
  props: {
    isChecked: {
      type: Boolean,
      default: false
    },
    small: {
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
  width: 26px;
  height: 26px;
  outline: 0;
  // padding: 3px;
  font-size: 18px;
  border-radius: 26px;
  border: 3px solid @background-btn-default;
  transition: background-color 100ms;
  cursor: pointer;
  user-select: none;
  &::after {
    content: '';
    position: absolute;
    top: 3px;
    left: 3px;
    bottom: 3px;
    right: 3px;
    border-radius: 50%;
    transition: .2s;
  }

  &[small] {
    transform: scale(.8);
  }
}
.toggle-switch-on {
  &::after {
    background-color: lighten(@background-btn-highlight, 10%);
  }
}
</style>
