<template>
  <div class="container">
    <div class="star-bg">
      <img @click="star(index)" v-for="(item, index) in 5" :key="item" src="../assets/images/star_empty@2x.png" alt="" />
    </div>
    <div class="star">
      <img @click="star(index)" v-for="(item, index) in score" :key="item" src="../assets/images/star_fill@2x.png" alt="" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
@Component
export default class Star extends Vue {
  @Prop({ type: Number, default: 5 }) score!: number

  // 是否只读
  @Prop({ type: Boolean, default: true }) readonly!: boolean
  star(index: number) {
    if (this.readonly) return
    // 传递给父组件
    this.$emit('changeScore', index + 1)
  }
}
</script>

<style lang="scss" scoped>
.container {
  position: relative;
}
.star,
.star-bg {
  float: left;
  display: flex;
  height: 25px;
  align-items: center;
  img {
    width: 20px;
    height: 19px;
  }
}
.star {
  position: absolute;
  top: 0;
  left: 0;
}
</style>
