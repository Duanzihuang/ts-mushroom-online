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
      <modal @postComment="postComment" @close="closeModal" :visible="isShowCommentModal">
        <div class="comment-content">
          <textarea style="overflow-x:hidden" v-model="content" placeholder="请输入评论内容哦~" rows="5" />
        </div>
        <div style="margin-top:10rpx;display:flex;">
          <span>评分：</span>
          <div style="margin-top:-3px;">
            <star :score="score" @changeScore="getChangeSocre" :readonly="false" />
          </div>
        </div>
      </modal>
      <div class="comment">
        <img @click="evaluate" src="../../assets/images/evaluate@2x.png" alt />
      </div>
    </div>
    <!-- 4.0 课程进度 -->
    <div class="course-progress">
      <div class="title">课程进度</div>
      <div class="catelog-container">
        <div @click="playOneVideo(item, index)" v-for="(item, index) in courseDetail.videos" :key="item.id" class="course-item">
          <span :class="[index === playIndex ? 'active' : '']">{{ index + 1 }}.{{ item.name }}</span>
          <span v-if="item.is_study === 1" class="studied">已学习</span>
          <span :class="['time', index === playIndex ? 'active' : '']" v-else>{{ item.duration }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import NavBar from '../../components/MyNavBar.vue'
import Modal from '../../components/Modal.vue'
import Star from '../../components/Star.vue'
import { Dialog } from 'vant'

// 参考：https://www.jianshu.com/p/7ed6d954164f?utm_source=oschina-app
@Component({
  components: {
    NavBar,
    Modal,
    Star
  }
})
export default class Play extends Vue {
  $axios: any
  courseDetail: any
  isValidateRight: any
  playIndex: any
  videoUrl: any
  isShowCommentModal: any
  content: any
  score: any

  data() {
    return {
      courseDetail: null, // 课程详情
      videoUrl: null, // 播放视频的url地址
      playIndex: 0, // 播放的索引
      isValidateRight: false, // 是否检验过播放权限
      isShowCommentModal: false, // 是否显示评论框
      content: '', // 评论内容
      score: 5 // 评论分数
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

  updated() {
    ;(this.$refs.videoRef as any).addEventListener('play', () => {
      if (!this.isValidateRight) {
        this.validatePlayRight()
      }
    })
  }

  async getCourseDetailData() {
    const result = await this.$axios.get(`course/play/${this.$route.params.id}`)

    if (result.data.status === 0) {
      this.courseDetail = result.data.message

      this.videoUrl = result.data.message.course.course_video_url
    }
  }

  // 评价
  async evaluate() {
    // 查询是否学习完毕了该课程，如果是则弹出评论对话框，如果不是，则提示
    const res = await this.$axios.get('study/complete', {
      params: {
        ['course_id']: this.$route.params.id
      }
    })

    if (res.data.complete) {
      // 学习完毕了，可以评论了
      this.isShowCommentModal = true
    } else {
      // 没有学习完毕
      Dialog.alert({
        title: '提示',
        message: '需要学习完课程才能评价哦~'
      })
    }
  }

  // 播放某个视频
  async playOneVideo(item: any, index: number) {
    this.playIndex = index

    // 检测播放权限
    const isCanPlay = await this.validatePlayRight()
    if (!isCanPlay) return
    ;(this.$refs.videoRef as any).src = item.video_url
    setTimeout(() => {
      ;(this.$refs.videoRef as any).play()
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
    const result = await this.$axios.get(`order/paystatus?course_id=${this.$route.params.id}`)

    if (result.data.status === 0) {
      if (result.data.pay_status === 0) {
        // 未支付
        ;(this.$refs.videoRef as any).pause()
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
        this.isValidateRight = true
        return Promise.resolve(true) // 已经支付
      }
    } else {
      return Promise.resolve(false)
    }
  }

  closeModal() {
    this.isShowCommentModal = false
  }

  // 获取更改之后的分数
  getChangeSocre(score: number) {
    this.score = score
  }

  // 提交评论
  async postComment() {
    if (this.content.trim().length === 0) {
      this.$toast({
        type: 'fail',
        message: '评价内容不能为空',
        duration: 1000
      })
      return
    }

    const result = await this.$axios.post('comment/create', {
      ['course_id']: this.$route.params.id,
      content: this.content,
      score: this.score
    })

    if (result.data.status === 0) {
      this.closeModal()

      this.$toast({
        type: 'success',
        message: '评价成功',
        duration: 1000,
        onClose: () => {
          this.$router.go(-1)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.play-container {
  padding-top: 46px;
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
    font-size: 15px;
    width: 98%;
    height: 100px;
  }
}
</style>
