<template>
  <div class="radio-div">
    <div class="radio-option" v-for="index in radioNumber" :key="index - 1">
      <input type="radio" :name="name" :value="value[index - 1]" v-model="currentValue">
      <label>{{ text[index - 1] }}</label>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CheckRadio',
  data () {
    return {
      name: String(Math.random())
    }
  },
  props: {
    valueStr: {
      type: String,
      default: ''
    },
    textStr: {
      type: String,
      default: ''
    },
    checkedValue: {
      type: String,
      default: ''
    }
  },
  computed: {
    value () {
      return this.valueStr.split('|')
    },
    text () {
      return this.textStr.split('|')
    },
    radioNumber () {
      return this.value.length
    },
    currentValue: {
      set (newVal) {
        this.$emit('check-change', newVal)
      },
      get () {
        return this.checkedValue
      }
    }
  }
}
</script>

<style lang='less' scoped>
@import '~@/assets/themes/config';
@import '~@/assets/themes/@{theme-name}/theme';
.radio-div {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  justify-content: space-between;
  font-size: 20px;
  .radio-option {
    position: relative;
    height: 100%;
    label {
      display: flex;
      flex-direction: row;
      align-items: center;
    }
    input[type = 'radio'] {
      display: inline-flex;
      margin: 0;
      opacity: 0;
      position: absolute;
      left: 0;
      top: 0;
      z-index: 1;
      width: 100%;
      height: 100%;
    }
    input[type = 'radio'] + label::before {
      display: inline-flex;
      box-sizing: border-box;
      content: '';
      border: 1px solid @color-line-default;
      border-radius: .78em;
      width: 26px;
      height: 26px;
      position: relative;
      cursor: pointer;
      transition: 200ms;
    }
    input[type = "radio"]:checked + label::before {
      background-color: @background-btn-highlight;
      box-shadow: inset 0 0 0 3px @color-shadow;
    }
  }
}
</style>
