<template>
  <div class="weui-search-bar__box">
    <i class="iconfont icon-sousuo"></i>
    <p class="weui-search-bar__input">{{tips}}</p>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class HelloWorld extends Vue {
  @Prop() tips!: string

  search() {
    this.$router.push('/search')
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
$weuiSearchBarHeight: 36px;
.weui-icon-search_in-box {
  position: absolute;
  height: $weuiSearchBarHeight;
  left: 8px;
  top: 8px;
}
.icon-sousuo{
  color: #ff8d44;
  font-size: 18px;
}
.weui-search-bar__input {
  margin: 0px 0 0 3px;
  height: $weuiSearchBarHeight;
  line-height: $weuiSearchBarHeight;
  display: inline-block;
  font-size: 14px;
  color: #999;
}
</style>
