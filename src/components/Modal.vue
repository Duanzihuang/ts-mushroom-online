<template>
    <div @click="closeModal" @touchmove="touchmove" class="modal-mask" v-show="visible">
        <div @click="noImplement" :style="{top:top+'px'}" class="modal-content">
            <div class="modal-title" v-if="title">{{ title }}</div>
            <div class="modal-body">
                <slot />    
            </div>
            <div @click="postComment" class="modal-action">提交</div>
        </div>
    </div>
</template>

<script lang="ts">
    import { Vue,Component,Prop } from 'vue-property-decorator'

    @Component
    export default class Modal extends Vue{
        // 标题
        @Prop({type:String}) title?:string
        // 是否可见
        @Prop({type:Boolean}) visible?:boolean
        // 距离顶部的距离
        @Prop({type:Number,default:175}) top!:number
        // 关闭窗口
        closeModal() {
            this.$emit('close')
        }

        // 点击了内容区域
        noImplement(e:any) {
            // 阻止事件冒泡
            e.stopPropagation()
        }

        // 手指移动
        touchmove(e:any){
          // 阻止事件冒泡
          e.preventDefault()
        }
            
        // 提交
        postComment() {
          this.$emit('postComment')
        }
    }
</script>

<style lang="scss" scoped>
.modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 10;
  transition: all 0.2s ease-in-out;
}
.modal-content {
  margin: 150px auto 0;
  width: 300px;
  border-radius: 3px;
  padding: 7px 7px 5px 7px;
  // position:relative;
  background-color: #fff;
  border: 1px solid #e0e0e0;
  background-clip: padding-box;
  overflow: hidden;
}
.modal-title {
  padding: 3px 7px 7px;
  margin: 0;
  font-size: 18px;
  line-height: 1;
  color: #1c2438;
  text-align: center;
}
.modal-body {
  margin-bottom: 25px;
  font-size: 14px;
  color: #80848f;
  height: 100%;
  line-height: 1.5;
  overflow: auto;
}
.modal-action {
  border-top: 1px solid #e0e0e0;
  margin-top: 15px;
  padding-top: 5px;
  height: 40px;
  line-height: 40px;
  color: #ff994d;
  font-size: 16px;
  text-align: center;
}
</style>