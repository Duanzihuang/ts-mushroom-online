<template>
  <div class="mp-circle-container">
    <canvas
      :width="this.width"
      :height="this.height"
      class="mp-circle"
      :id="'canvasId' + canvasId"
    ></canvas>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class Circle extends Vue {
  @Prop({ type: Number, default: 0 }) canvasId!: number
  @Prop({ type: Number, default: 0 }) progress!: number
  @Prop({ type: Number, default: 55 }) width!: number
  @Prop({ type: Number, default: 55 }) height!: number
  @Prop({ type: Number, default: 5 }) lineWidth!: number
  @Prop({ type: String, default: '#F3F3F3' }) backgroundColor!: string
  @Prop({ type: String, default: '#F3F3F3' }) foregroundColor!: string
  data() {
    return {
      myForegroundColor: null
    }
  }
  mounted() {
    this.drawProgress()
  }
  // 绘制学习进度
  drawProgress() {
    // canvas
    const ctx = document
      .getElementById(`canvasId` + this.canvasId)
      .getContext('2d')

    // 绘制背景色
    ctx.beginPath()
    ctx.strokeStyle = this.backgroundColor
    ctx.lineWidth = 5
    // 绘制圆
    ctx.arc(
      this.width / 2,
      this.height / 2,
      this.width / 2 - this.lineWidth,
      0,
      2 * Math.PI,
      true
    )
    ctx.stroke()

    // 绘制前景色
    if (this.progress <= 30) {
      this.myForegroundColor = '#ff0000'
    } else if (this.progress > 30 && this.progress < 50) {
      this.myForegroundColor = '#FF783B'
    } else {
      this.myForegroundColor = '#B4D66E'
    }
    ctx.beginPath()
    ctx.strokeStyle = this.myForegroundColor
    ctx.lineCap = 'round'
    ctx.arc(
      this.width / 2,
      this.height / 2,
      this.width / 2 - this.lineWidth,
      -0.5 * Math.PI,
      (this.progress / 100) * 2 * Math.PI - 0.5 * Math.PI,
      false
    )
    ctx.stroke()
    // 绘制文字
    ctx.beginPath()
    ctx.fillStyle = this.myForegroundColor
    // ctx.setFontSize(12)
    const fontSize = 12
    ctx.font = fontSize + 'px Helvetica'
    // // 获取文字的宽度
    const textWidth = ctx.measureText(parseInt(this.progress) + '%').width
    ctx.fillText(
      parseInt(this.progress) + '%',
      this.width / 2 - textWidth / 2,
      this.height / 2 + fontSize / 2 - 3
    )
    // if (this.progress >= 99) {
    //   ctx.fillText(
    //     this.progress + '%',
    //     this.width / 2 - 13,
    //     this.height / 2 + 6
    //   )
    // } else {
    //   ctx.fillText(
    //     this.progress + '%',
    //     this.width / 2 - 10,
    //     this.height / 2 + 6
    //   )
    // }
  }
}
</script>

<style lang="scss" scoped>
.mp-circle-container {
  position: relative;
}
.mp-circle {
  position: absolute;
  left: 0;
  right: 0;
  margin: auto;
}
</style>
