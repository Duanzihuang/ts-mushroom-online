<template>
  <div class="layout">
    <router-view />
    <van-tabbar inactive-color="#999" active-color="#ff9a29" v-model="active">
      <van-tabbar-item replace to="/layout/home" :icon="active === 0 ? homeSelectIcon : homeIcon">
        首页</van-tabbar-item>
      <van-tabbar-item replace to="/layout/course" :icon="active === 1 ? courseSelectIcon : courseIcon">
        课程</van-tabbar-item>
      <van-tabbar-item replace to="/layout/study" :icon="active === 2 ? studySelectIcon : studyIcon">
        学习</van-tabbar-item>
      <van-tabbar-item replace to="/layout/my" :icon="active === 3 ? mySelectIcon : myIcon">
        我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Tabbar, TabbarItem } from 'vant'

@Component({
  components: {
    'van-tabbar': Tabbar,
    'van-tabbar-item': TabbarItem
  }
})
export default class Layout extends Vue {
  data() {
    return {
      active: 0,
      homeIcon: require('../../assets/tabs/icon_home@2x.png'),
      homeSelectIcon: require('../../assets/tabs/icon_home_selected@2x.png'),
      courseIcon: require('../../assets/tabs/icon_course@2x.png'),
      courseSelectIcon: require('../../assets/tabs/icon_course_selected@2x.png'),
      studyIcon: require('../../assets/tabs/icon_study@2x.png'),
      studySelectIcon: require('../../assets/tabs/icon_study_selected@2x.png'),
      myIcon: require('../../assets/tabs/icon_my@2x.png'),
      mySelectIcon: require('../../assets/tabs/icon_my_selected@2x.png')
    }
  }
  created(){
    switch (this.$route.path) {
      case '/layout/home':
        this.active = 0
        break;

      case '/layout/course':
        this.active = 1
        break;

      case '/layout/study':
        this.active = 2
        break;

      case '/layout/my':
        this.active = 3
        break;
    
      default:
        break;
    }
  }
}
</script>

<style lang="scss" scoped>
.layout {
  height: 100%;
}
</style>
