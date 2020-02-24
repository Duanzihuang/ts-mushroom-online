<template>
  <div style="padding-top:46px;" class="course-detail-container" v-if="courseDetail">
    <!-- 导航条 -->
    <nav-bar title="课程详情" />
    <!-- 1.0 封面图 -->
    <div class="cover_image">
      <div v-if="!isPlaying" class="cover_image">
        <img :src="courseDetail.course.cover_image_url" alt />
        <div class="play">
          <img @click="playCourseVideo" src="../../assets/images/play@2x.png" alt />
          <p>播放课程简介</p>
        </div>
      </div>
      <div v-else class="course_video">
        <video controls="controls" ref="videoRef" :src="courseDetail.course.course_video_url" autoplay></video>
      </div>
    </div>
    <!-- 2.0 简介 -->
    <div class="introduction">
      <div class="title-price">
        <p>{{ courseDetail.course.title }}</p>
        <p>￥{{ courseDetail.course.price }}.00</p>
      </div>
      <p class="introduce">{{ courseDetail.course.introduction }}</p>
      <div class="star">
        <star :score="courseDetail.course.score"></star>
        <p>{{ courseDetail.course.study_count }}人在学</p>
      </div>
      <div class="study-share">
        <img @click="goToStudy" src="../../assets/images/start_study@2x.png" alt />
        <button class="share-button" plain></button>
      </div>
    </div>
    <!-- 3.0 目录、讲师介绍、评价 -->
    <div class="catalog">
      <div class="head">
        <span :class="[index == selectIndex ? 'active' : '']" v-for="(item, index) in menus" :key="index" @click="toggleSelect(index)">
          {{ item }}
        </span>
      </div>
      <div class="body">
        <!-- 目录 -->
        <div class="catelog-container" v-if="selectIndex === 0">
          <p v-for="(item, index) in courseDetail.videos" :key="item.id">{{ index + 1 }}.{{ item.name }}</p>
        </div>
        <!-- 讲师介绍 -->
        <div class="lecturer-container" v-else-if="selectIndex === 1">
          <div v-if="courseDetail.lecturer" class="info">
            <img :src="courseDetail.lecturer.avatar" alt />
            <div class="name-follow">
              <p>{{ courseDetail.lecturer.name }}</p>
              <p>关注人数：{{ courseDetail.lecturer.follow_count }}</p>
            </div>
            <span @click="followOrUnFollow(courseDetail.lecturer.is_follow, courseDetail.lecturer.id)" :class="[courseDetail.lecturer.is_follow === 1 ? 'follow' : 'unfollow']">
              {{ courseDetail.lecturer.is_follow === 1 ? '已关注' : '关注' }}
            </span>
          </div>
          <div v-if="courseDetail.lecturer" class="introduce">
            <p>{{ courseDetail.lecturer.introduction }}</p>
          </div>
          <p style="color:#636363;font-size:15px;" v-if="!courseDetail.lecturer">
            暂无讲师简介哦~
          </p>
        </div>
        <!-- 评价 -->
        <div v-else class="comment-container">
          <div class="comment-item" v-for="item in courseDetail.comments" :key="item.id">
            <div class="info">
              <img :src="item.avatar" alt />
              <div class="nickname-content">
                <div class="nickname">
                  <div style="margin-top:12px;">{{ item.nickname }}</div>
                  &nbsp;&nbsp;
                  <div style="margin-left:10px">
                    <star :score="item.score" />
                  </div>
                </div>
                <div>{{ item.content }}</div>
              </div>
              <div class="time">{{ item.comment_time }}</div>
            </div>
            <div class="star">
              <img @click="like(item)" :src="item.is_like === 1 ? unlikeImg : likeImg" alt />
            </div>
          </div>
          <span style="color:#636363;font-size:15px;padding-left:5px;" v-if="!courseDetail.comments">暂无评论哦，请学习之后再评价~</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import MyNavBar from '../../components/MyNavBar.vue'
import Star from '../../components/Star.vue'

@Component({
  components: {
    'nav-bar': MyNavBar,
    Star
  }
})
export default class My extends Vue {
  $axios: any
  courseDetail: any
  isPlaying: any
  selectIndex: any
  menus: any

  data() {
    return {
      courseDetail: null, // 课程详情数据
      isPlaying: false, // 是否正在播放
      selectIndex: 0, // 选中的索引
      menus: ['目录', '讲师介绍', '评价'],
      unlikeImg: require('../../assets/images/like_normal@2x.png'),
      likeImg: require('../../assets/images/like_highlight@2x.png')
    }
  }
  created() {
    // 获取详情数据
    this.getCourseDetailData()
  }
  async getCourseDetailData() {
    const result = await this.$axios.get(`course/${this.$route.params.id}`)
    if (result.data.status === 0) {
      this.courseDetail = result.data.message

      this.menus[2] = `评价(${result.data.message.commentTotal})`
    }
  }
  // 播放课程简介视频
  playCourseVideo() {
    this.isPlaying = true
  }
  // 跳转到学习页面
  goToStudy() {
    this.$refs.videoRef && (this.$refs.videoRef as any).pause()
    this.$router.push(`/play/${this.$route.params.id}`)
  }
  async toggleSelect(index: number) {
    this.selectIndex = index
  }
  // 关注与取消关注
  async followOrUnFollow(isFollow: number, id: number) {
    switch (isFollow) {
      case 0: {
        // 去关注
        const res1 = await this.$axios.post('lecturer/follow', {
          ['lecturer_id']: id
        })
        if (res1.data.status === 0) {
          this.courseDetail.lecturer['is_follow'] = 1

          this.$toast({
            message: res1.data.message,
            icon: 'none',
            duration: 500
          })
        }
        break
      }

      case 1: {
        // 取消关注
        const res2 = await this.$axios.post('lecturer/unfollow', {
          ['lecturer_id']: id
        })
        if (res2.data.status === 0) {
          this.courseDetail.lecturer['is_follow'] = 0

          this.$toast({
            message: res2.data.message,
            icon: 'none',
            duration: 500
          })
        }
        break
      }
      default:
        break
    }
  }
  // 点赞与取消点赞
  async like(comment: any) {
    switch (comment['is_like']) {
      case 1: {
        comment['is_like'] = 2
        break
      }

      case 2: {
        comment['is_like'] = 1
        break
      }

      default:
        break
    }

    // 发请求
    const res = await this.$axios.post('comment/like', {
      ['comment_id']: comment.id,
      ['is_like']: comment['is_like']
    })

    // if (res.data.status === 0) {
    //   this.$toast({
    //     message: res.data.message,
    //     icon: 'none',
    //     duration: 500
    //   })
    // }
  }
}
</script>

<style lang="scss" scoped>
.course-detail-container {
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
    position: relative;
    .play {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      position: absolute;
      img {
        margin-top: 30px;
        width: 82px;
        height: 82px;
      }
      p {
        margin-top: 5px;
        color: #e9e9e9;
        font-size: 15px;
      }
    }
  }
  .course_video {
    width: 375px;
    height: 217px;
    video {
      width: 375px;
      height: 217px;
    }
  }
  .introduction {
    z-index: 3;
    position: absolute;
    margin-top: 0px;
    border-radius: 8px 8px 0px 0px;
    left: 0;
    right: 0;
    height: 226px;
    background-color: #ffffff;
    padding: 10px 15px;
    .title-price {
      margin-top: 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      p:nth-child(1) {
        font-size: 24px;
        margin: 0;
        color: #343434;
        font-weight: Bold;
      }
      p:nth-child(2) {
        font-size: 22px;
        margin: 0;
        color: #ee3939;
      }
    }
    .introduce {
      color: #818181;
      font-size: 14px;
      line-height: 22px;
      margin: 5px 0px 0px 0px;
    }
    .star {
      display: flex;
      align-items: center;
      margin-top: 5px;
      p {
        height: 25px;
        line-height: 25px;
        margin-left: 10px;
        font-size: 12px;
        color: #fe8e38;
      }
    }
    .study-share {
      margin-top: 10px;
      margin-bottom: 26px;
      img:nth-child(1) {
        width: 284px;
        height: 46px;
      }
      .share-button {
        border: none;
        width: 46px;
        height: 46px;
        background-color: #fff;
        border-radius: 5px;
        display: flex;
        justify-content: center;
        align-items: center;
        float: right;
        background-image: url(../../assets/images/share@2x.png);
        background-repeat: no-repeat;
        background-size: 15px 15x;
        background-position: 0px 0px;
      }
    }
  }
  .catalog {
    margin-top: 260px;
    // position: absolute;
    z-index: 5;
    width: 375px;
    // height: 582px;
    background-color: #ffffff;
    .head {
      height: 60px;
      background-color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #f5f5f5;
      span {
        text-align: center;
        color: #a8a8a8;
        font-size: 14px;
        height: 60px;
        line-height: 60px;
        flex: 1;
        position: relative;
      }
      .active {
        color: #333333;
        font-weight: bold;
        &::after {
          content: '';
          position: absolute;
          left: 44px;
          bottom: 0px;
          width: 37px;
          height: 3px;
          background-color: #ff8e43;
        }
      }
    }
    .catelog-container {
      padding: 15px;
      // height: 291px;
      p {
        background-color: #ffffff;
        color: #636363;
        font-size: 15px;
        margin: 0;
        height: 40px;
        line-height: 40px;
        display: block;
      }
    }
    .lecturer-container {
      padding: 15px;
      .info {
        height: 100px;
        display: flex;
        align-items: center;
        .name-follow {
          margin-left: 15px;
          display: flex;
          flex-direction: column;
          flex: 1;
          p:nth-child(1) {
            margin: 0;
            font-size: 17px;
            color: #333333;
          }
          p:nth-child(2) {
            margin: 0;
            font-size: 14px;
            margin-top: 15px;
            color: #a8a8a8;
          }
        }
        img {
          margin-left: 12px;
          width: 60px;
          height: 60px;
        }
        .unfollow {
          width: 68px;
          height: 26px;
          line-height: 26px;
          text-align: center;
          border: 1px solid #a8a8a8;
          border-radius: 13px;
          color: #a8a8a8;
          font-size: 14px;
        }
        .follow {
          width: 68px;
          height: 26px;
          line-height: 26px;
          text-align: center;
          border: 1px solid #a8a8a8;
          border-radius: 13px;
          color: #fff;
          background-color: #a8a8a8;
          font-size: 14px;
        }
      }
      .introduce {
        background-color: #ffffff;
        p {
          margin: 0;
          margin-left: 12px;
          font-size: 14px;
          font-family: PingFang SC;
          font-weight: 400;
          line-height: 20px;
          color: rgba(168, 168, 168, 1);
          opacity: 1;
        }
      }
    }
    .comment-item {
      background-color: #ffffff;
      padding: 15px;
      height: 90px;
      border-bottom: 2px solid #f1f1f1;
      .info {
        height: 60px;
        display: flex;
        align-items: center;
        img {
          margin-left: 6px;
          width: 48px;
          height: 48px;
          border-radius: 50%;
        }
        .nickname-content {
          flex: 1;
          margin-left: 15px;
          .nickname {
            color: #333333;
            font-size: 15px;
            font-weight: bold;
            align-items: center;
            display: flex;
            div {
              height: 100%;
              display: inline-block;
            }
          }
          div:nth-child(2) {
            margin-top: 16px;
            color: #a8a8a8;
            font-size: 12px;
          }
        }
        .time {
          color: #a8a8a8;
          font-size: 11px;
        }
      }
    }
    .star {
      img {
        margin-top: 0px;
        width: 22px;
        height: 22px;
        float: right;
        margin-right: 15px;
      }
      img:nth-child(0) {
        margin-right: 15px;
      }
    }
  }
}
</style>
