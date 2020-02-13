<template>
  <div class="study-container">
    <nav-bar :isShowLeftArrow="false" title="学习进度" />
    <div class="study-item" v-for="item in studyProgresses" :key="item.sid">
      <img :src="item.icon" alt />
      <div class="meta">
        <p class="title">{{ item.title }}</p>
        <p class="progress">
          已学习{{ item.study_hour }}课时/{{ item.total_hour || 0 }}课时
        </p>
      </div>
      <div class="circle">
        <progress-circle
          :canvasId="item.sid"
          :progress="item.study_progress"
          :width="55"
          :height="55"
        ></progress-circle>
      </div>
    </div>
    <div v-if="studyProgresses.length === 0">
      <p class="no-study-tip">您还没有任何学习记录哦，赶快去学习吧~</p>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import NavBar from '../../components/MyNavBar.vue'
import ProgressCircle from '../../components/ProgressCircle.vue'

@Component({
  components: {
    NavBar,
    ProgressCircle
  }
})
export default class Study extends Vue {
  data() {
    return {
      studyProgresses: []
    }
  }
  created() {
    this.getStudyProgressData()
  }
  async getStudyProgressData() {
    const result = await this.$axios.get('study/progress')

    if (result.data.status === 0) {
      this.studyProgresses = result.data.message
    }
  }
}
</script>

<style lang="scss" scoped>
.study-container {
  padding-top: 46px;
  display: flex;
  flex-direction: column;
  padding-bottom: 16px;
  align-items: center;
  position: relative;
}
.study-item {
  margin-top: 16px;
  background-color: #fff;
  border-radius: 6px;
  width: 343px;
  height: 110px;
  display: flex;
  align-items: center;
  img {
    width: 54px;
    height: 54px;
    margin-left: 25px;
  }
  .meta {
    flex: 1;
    margin-left: 25px;
    .title {
      font-size: 15px;
      color: #333333;
    }
    .progress {
      margin-top: 5px;
      font-size: 11px;
      color: #a8a8a8;
    }
  }
  .circle {
    width: 55px;
    height: 55px;
    margin-right: 18px;
  }
}
.no-study-tip {
  margin-top: 250px;
  font-size: 15px;
}
</style>
