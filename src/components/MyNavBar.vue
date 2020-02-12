<template>
  <div>
    <van-nav-bar
      fixed
      :title="title"
      @click-left="onClickLeft"
      :left-text="leftText"
      :left-arrow="isShowLeftArrow"
    >
      <slot />
    </van-nav-bar>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { NavBar } from 'vant'
@Component({
  components: {
    'van-nav-bar': NavBar
  }
})
export default class MyNavBar extends Vue {
  @Prop() title?: string
  @Prop() leftText?: string
  @Prop({ type: Boolean, default: true }) isShowLeftArrow?: boolean

  onClickLeft() {
    this.$router.back()
  }
}
</script>

<style lang="scss" scoped>
.van-nav-bar .van-icon {
  color: black;
  font-size: 22px;
}
</style>
