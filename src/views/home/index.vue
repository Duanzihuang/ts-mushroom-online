<template>
  <div class="home-container">
    <!-- 搜索条 -->
    <search-bar tips="请输入课程的名称"></search-bar>
    <!-- 轮播图 -->
    <van-swipe class="swipe" :autoplay="3000" indicator-color="white">
      <van-swipe-item v-for="item in swipers" :key="item.id" class="swipe-item">
          <router-link :to="'/course-detail/'+item.course_id">
            <img :src="item.img_url" alt="">
          </router-link>
      </van-swipe-item>
    </van-swipe>
     <!-- 推荐课程 -->
     <div>
      <div class="tips">
        <p>推荐课程</p>
        <img @click="goToCoursePage" src="../../assets/images/arrow@2x.png" alt />
      </div>
      <div class="course-container">
        <div class="course-item" v-for="item in courses" :key="item.id">
          <router-link :to="'/course-detail/'+item.relation_id">
            <img :src="item.icon" alt="">
          </router-link>
        </div>
      </div>
    </div>
    <!-- 热门视频 -->
    <div>
      <div class="tips">
        <p>热门视频</p>
        <img @click="goToCourseDetail(3)" src="../../assets/images/arrow@2x.png" alt />
      </div>
      <div class="hot-video">
        <div class="video-item" v-for="item in videos" :key="item.id">
          <router-link :to="'/course-detail/'+item.course_id">
            <img :src="item.cover_photo_url" alt />
            <div>
              <p class="title">{{item.name}}</p>
            </div>
            <div>
              <p class="subtitle">{{item.view_count}}人已观看</p>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Swipe, SwipeItem } from 'vant'
import SearchBar from '../../components/SearchBar.vue'

@Component({
  components: {
    "van-swipe":Swipe, 
    "van-swipe-item":SwipeItem,
    SearchBar
  }
})
export default class Home extends Vue {
  data() {
    return {
      swipers: [], // 轮播图
      courses: [], // 推荐课程
      videos: [] // 热门视频
    }
  }
  created() {
    this.getSwipersData()
    this.getRecommendCoursesData()
    this.getHotVideosData()
  }
  // 获取轮播图数据
  async getSwipersData() {
    const res = await this.$axios.get('home/swipers')
    if (res.data.status === 0) {
      this.swipers = res.data.message
    }
  }
  // 获取推荐课程数据
  async getRecommendCoursesData() {
    const res = await this.$axios.get('home/course')
    if (res.data.status === 0) {
      this.courses = res.data.message
    }
  }
  // 获取热门视频
  async getHotVideosData() {
    const res = await this.$axios.get('home/video')
    if (res.data.status === 0) {
      this.videos = res.data.message
    }
  }
  // 切换到课程页面
  goToCoursePage() {
    this.$router.push('/layout/course')
  }
  // 跳转到课程详情页面
  goToCourseDetail(id: number) {
    this.$router.push('/course-detail/'+id)
  }
}
</script>

<style lang="scss" scoped>
.home-container {
  padding: 8px 8px 0 8px;
  background-color: #fff;
}
.swipe {
  width: 100%;
  height: 171px;
  .swipe-item {
    width: 100%;
    height: 100%;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
.tips {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  p {
    font-size: 15px;
    font-weight: 700;
    color: #212121;
  }
  img {
    width: 24px;
    height: 24px;
  }
}
.course-container {
  height: 85px;
  white-space: nowrap;
  overflow-x:auto;
  overflow-y:hidden;
  .course-item {
    width: 148px;
    height: 84px;
    display: inline-block;
    margin-right: 16px;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
.hot-video {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  .video-item {
    width: 150px;
    img {
      width: 150px;
      height: 95px;
      border-radius: 6px;
    }
    .title {
      margin-top: 3px;
      color: #262626;
      font-size: 13px;
    }
    .subtitle {
      margin-top: 3px;
      color: #959595;
      font-size: 10px;
    }
  }
}
::-webkit-scrollbar{
  display: none;
}
</style>
