<template>
  <div class="search-container">
    <nav-bar title="搜索" />
    <div class="search-head">
      <input
        v-model="keyword"
        class="search-input"
        placeholder="请输入课程名称"
        type="text"
        @focus="focus"
        @keyup.enter="getCoursesData"
      />
      <i class="iconfont icon-sousuo" style="font-size:15px;"></i>
      <span v-show="isFocus" @click="cancel" class="search-button">取消</span>
    </div>
    <div class="search-body">
      <div class="empty" v-if="courses.length === 0">
        <p class="title">暂无内容哦~</p>
      </div>
      <course-list :courses="courses" />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import NavBar from '../../components/MyNavBar.vue'
import CourseList from '../../components/CourseList.vue'

@Component({
  components: {
    NavBar,
    CourseList
  }
})
export default class Search extends Vue {
  data() {
    return {
      keyword: '', // 关键字
      isFocus: false, // 是否聚焦
      courses: []
    }
  }
  async focus() {
    this.isFocus = true
  }
  // 取消
  async cancel() {
    this.isFocus = false
    this.keyword = ''
    this.getCoursesData()
  }
  // 搜索
  async getCoursesData() {
    const result = await this.$axios.get('course/search', {
      params: {
        name: this.keyword
      }
    })

    if (result.data.status === 0) {
      this.courses = result.data.message
    }
  }
}
</script>

<style lang="scss" scoped>
.search-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding-top: 46px;
}
.search-head {
  padding: 15px 0;
  background-color: #fff;
  display: flex;
}
.search-input {
  margin-left: 15px;
  margin-right: 15px;
  padding-left: 27px;
  width: 100%;
  height: 37px;
  background: rgba(243, 243, 243, 1);
  opacity: 1;
  border-radius: 4px;
  font-size: 14px;
  flex: 1;
  border: 1px solid white;
}
.icon-sousuo {
  position: absolute;
  left: 25px;
  top: 75px;
  //   width: 32px;
  //   height: 32px;
  color: #a8a8a8;
}
.search-button {
  margin-right: 15px;
  font-size: 18px;
  width: 50px;
  height: 37px;
  line-height: 37px;
  text-align: center;
  color: #ff951c;
}
.search-body {
  display: flex;
  flex-wrap: wrap;
  padding-bottom: 16px;
  width: 100%;
  height: 100%;
}
.empty {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 300px;
}
.empty .title {
  font-size: 14px;
  color: gray;
}
</style>
