<template>
  <div class="play-container" v-if="courseDetail">
    <!-- 1.0 NavBar -->
    <nav-bar />
    <!-- 2.0 视频播放器 -->
    <div class="cover_image">
      <video ref="videoRef" :src="videoUrl" controls></video>
    </div>
    <!-- 3.0 简介 -->
    <div class="introduction">
      <div class="title-and-info">
        <p class="title">{{ courseDetail.course.title }}</p>
        <div class="info">
          <span>{{ courseDetail.course.study_count }}人学过</span>
          <span>难度:{{ level }}</span>
          <span>时长:{{ courseDetail.course.course_duration }}</span>
        </div>
      </div>
      <div class="comment">
        <img @click="evaluate" src="../../assets/images/evaluate@2x.png" alt />
      </div>
    </div>
    <!-- 4.0 课程进度 -->
    <div class="course-progress">
      <div class="title">课程进度</div>
      <div class="catelog-container">
        <div
          @click="playOneVideo(item, index)"
          v-for="(item, index) in courseDetail.videos"
          :key="item.id"
          class="course-item"
        >
          <span :class="[index === playIndex ? 'active' : '']"
            >{{ index + 1 }}.{{ item.name }}</span
          >
          <span v-if="item.is_study === 1" class="studied">已学习</span>
          <span :class="['time', index === playIndex ? 'active' : '']" v-else>{{
            item.duration
          }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import NavBar from '../../components/MyNavBar.vue'
import { Dialog } from 'vant'

// 参考：https://www.jianshu.com/p/7ed6d954164f?utm_source=oschina-app
@Component({
  components: {
    NavBar
  }
})
export default class Play extends Vue {
  data() {
    return {
      courseDetail: null, // 课程详情
      videoUrl: null, // 播放视频的url地址
      playIndex: 0 // 播放的索引
    }
  }

  // 计算属性
  get level() {
    let levelName = '初级'
    if (this.courseDetail) {
      const level = this.courseDetail.course.level
      switch (level) {
        case 1:
          levelName = '初级'
          break

        case 2:
          levelName = '中级'
          break

        case 3:
          levelName = '高级'
          break

        default:
          break
      }
    }

    return levelName
  }

  created() {
    this.getCourseDetailData()
  }

  async getCourseDetailData() {
    const result = await this.$axios.get(`course/play/${this.$route.params.id}`)

    if (result.data.status === 0) {
      this.courseDetail = result.data.message

      this.videoUrl = result.data.message.course.course_video_url
    }
  }

  // 评价
  evaluate() {
    console.log('111')
  }

  // 播放某个视频
  async playOneVideo(item: any, index: number) {
    this.playIndex = index

    // 检测播放权限
    const isCanPlay = await this.validatePlayRight()
    if (!isCanPlay) return

    this.$refs.videoRef.src = item.video_url
    setTimeout(() => {
      this.$refs.videoRef.play()
    }, 200)

    // 记录播放进度
    const result = await this.$axios.post('study/video', {
      ['course_id']: this.$route.params.id,
      ['video_id']: item.id
    })

    if (result.data.status === 0) {
      item['is_study'] = 1
    }
  }

  // 检查视频播放权限
  async validatePlayRight() {
    const result = await this.$axios.get(
      `order/paystatus?course_id=${this.$route.params.id}`
    )

    if (result.data.status === 0) {
      if (result.data.pay_status === 0) {
        // 未支付
        this.$refs.videoRef.pause()
        Dialog.confirm({
          title: '提示',
          message: '您还没有支付，请先支付后，\n再来观看哦~'
        })
          .then(() => {
            this.$router.push(
              `/pay?id=${this.$route.params.id}&title=${this.courseDetail.course.title}&price=${this.courseDetail.course.price}&cover_image_url=${this.courseDetail.course.cover_image_url}`
            )
          })
          .catch(() => {
            // on cancel
          })

        return Promise.resolve(false)
      } else {
        return Promise.resolve(true) // 已经支付
      }
    } else {
      return Promise.resolve(false)
    }
  }
}
</script>

<style lang="scss" scoped>
.play-container {
  background-color: #efefef;
  position: relative;
  .cover_image {
    width: 375px;
    height: 217px;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      width: 375px;
      height: 217px;
    }
    video {
      width: 375px;
      height: 217px;
    }
  }
  .introduction {
    z-index: 3;
    position: absolute;
    margin-top: -5px;
    border-radius: 8px 8px 0px 0px;
    border-bottom: 1px solid #f5f5f5;
    left: 0;
    right: 0;
    height: 96px;
    background-color: #ffffff;
    padding: 19px 16px;
    display: flex;
    align-items: center;
    .title-and-info {
      flex: 1;
      .title {
        margin: 0;
        color: #343434;
        font-size: 24px;
        font-weight: bold;
      }
      .info {
        margin-top: 6px;
        height: 17px;
        line-height: 17px;
        color: #818181;
        font-size: 12px;
        display: block;
        span {
          padding-right: 7px;
        }
        span:nth-child(2),
        span:nth-child(3) {
          padding-left: 15px;
        }
        span:nth-child(2) {
          position: relative;
          &::before {
            position: absolute;
            content: '';
            background-color: #ebebeb;
            left: 0px;
            width: 1px;
            top: 4px;
            height: 10px;
          }
          &::after {
            position: absolute;
            content: '';
            background-color: #ebebeb;
            right: 0px;
            width: 1px;
            top: 4px;
            height: 10px;
          }
        }
      }
    }
    .comment {
      margin-top: 16px;
      img {
        width: 99px;
        height: 40px;
      }
    }
  }
  .course-progress {
    margin-top: 111px;
    padding: 22px 16px;
    background-color: #fff;
    .title {
      color: #343434;
      font-size: 15px;
      font-family: PingFang SC;
      font-weight: 800;
    }
    .catelog-container {
      .course-item {
        display: flex;
        justify-content: space-between;
      }
      span {
        color: #636363;
        font-size: 15px;
        height: 40px;
        line-height: 40px;
      }
      .studied {
        float: right;
        margin-top: 8px;
        font-size: 10px;
        text-align: center;
        color: #aaaaaa;
        background-color: #f5f5f5;
        border-radius: 12px;
        width: 49px;
        height: 24px;
        line-height: 24px;
      }
      .time {
        float: right;
      }
      .active {
        color: #ff5e00;
      }
    }
  }
}
.comment-content {
  label {
    width: 50px;
  }
  textarea {
    width: 100%;
    height: 100px;
  }
}
</style>
