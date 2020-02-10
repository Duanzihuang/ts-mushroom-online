<template>
    <div class="container">
        <div class="star-bg">
            <img v-for="item in 5" :key="item" src="../assets/images/star_empty@2x.png" alt="">
        </div>
        <div class="star">
            <img v-for="item in myScroe" :key="item" src="../assets/images/star_fill@2x.png" alt="">
        </div>
    </div>
</template>

<script lang="ts">
    import {Component,Vue,Prop} from 'vue-property-decorator'
    @Component
    export default class Star extends Vue{
        @Prop() score!:number
        data() {
            return {
                myScroe: 0
            }
        }
        created(){
            this.myScroe = this.score
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