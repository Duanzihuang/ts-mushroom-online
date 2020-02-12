<template>
  <div class="my-container" v-if="userInfo">
    <!-- <nav-bar title="我的" :isShowLeftArrow="false" /> -->
    <div class="header">
      <img
        class="avatar"
        :src="userInfo.avatar || '../../assets/images/avatar@2x.png'"
        alt
      />
      <p class="nickname">{{ userInfo.nickname || '酷小鱼' }}</p>
    </div>
    <div class="tips">
      <div class="left">
        <p class="title">{{ userInfo.study_hour }}</p>
        <p class="subtitle">累计学习小时</p>
      </div>
      <div class="middle">
        <p class="title">{{ userInfo.follow_count }}</p>
        <p class="subtitle">我的关注</p>
      </div>
      <div class="right">
        <p class="title">{{ userInfo.course_count }}</p>
        <p class="subtitle">我的课程</p>
      </div>
    </div>
    <div class="cells">
      <div class="cell">
        <p>学习历史</p>
        <img src="../../assets/images/arrow@2x.png" alt />
      </div>
      <div class="cell">
        <p>消息提醒</p>
        <img src="../../assets/images/arrow@2x.png" alt />
      </div>
      <div @click="clearCache" class="cell">
        <p>清除缓存</p>
        <img src="../../assets/images/arrow@2x.png" alt />
      </div>
      <div class="cell">
        <p>商务合作</p>
        <img src="../../assets/images/arrow@2x.png" alt />
      </div>
      <div @click="contact" class="cell">
        <p>在线客服</p>
        <img src="../../assets/images/arrow@2x.png" alt />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import NavBar from '../../components/MyNavBar.vue'

@Component({
  components: {
    NavBar
  }
})
export default class My extends Vue {
  data() {
    return {
      userInfo: null
    }
  }
  created() {
    this.getUserInfoData()
  }
  async getUserInfoData() {
    const result = await this.$axios.get('/my/info')
    if (result.data.status === 0) {
      this.userInfo = result.data.message
    }
  }
  // 打电话
  contact() {
    window.location.href = 'tel://400-618-9090'
  }
  clearCache() {
    this.$toast.loading({
      message: '缓存清理中...',
      forbidClick: true,
      loadingType: 'spinner',
      duration: 2000,
      onClose: () => {
        this.$toast({
          type: 'success',
          duration: 500,
          message: '清理缓存成功'
        })
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.my-container {
  position: relative;
}
.header {
  width: 375px;
  height: 220px;
  background-color: #ff8d43;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  .avatar {
    width: 88px;
    height: 88px;
    border-radius: 50%;
  }
  .nickname {
    margin-top: 15px;
    font-size: 12px;
    color: #ffffff;
  }
}
.tips {
  position: absolute;
  top: 200px;
  left: 16px;
  right: 16px;
  border-radius: 6px;
  height: 87px;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-around;
  .title {
    text-align: center;
    font-size: 16px;
    color: #333333;
    font-weight: bold;
  }
  .subtitle {
    margin-top: 5px;
    text-align: center;
    font-size: 12px;
    color: #a8a8a8;
    font-weight: bold;
  }
  .left,
  .middle,
  .right {
    flex: 1;
  }
  .middle {
    position: relative;
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 15px;
      height: 31px;
      width: 1px;
      background-color: #ebebeb;
    }
    &::after {
      content: '';
      position: absolute;
      right: 0;
      top: 15px;
      height: 31px;
      width: 1px;
      background-color: #ebebeb;
    }
  }
}
.cells {
  background-color: #fff;
  border-radius: 6px;
  margin-top: 80px;
  margin-left: 16px;
  margin-right: 16px;
  height: 300px;
  margin-bottom: 16px;
  .cell {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #f8f8f8;
    padding: 0px 10px;
    p {
      font-size: 15px;
      color: #333333;
    }
    img {
      width: 24px;
      height: 24px;
    }
  }
}
</style>
