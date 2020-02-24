<template>
  <div style="padding-top:46px;">
    <nav-bar title="课程" :isShowLeftArrow="false" />
    <course-list :courses="courses" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import CourseList from '../../components/CourseList.vue'
import NavBar from '../../components/MyNavBar.vue'

@Component({
  components: {
    CourseList,
    NavBar
  }
})
export default class Course extends Vue {
  $axios: any
  courses: any

  data() {
    return {
      courses: []
    }
  }
  activated() {
    this.getCourseListData()
  }
  async getCourseListData() {
    const res = await this.$axios.get('course/list')

    if (res.data.status === 0) {
      this.courses = res.data.message
    }
  }
}
</script>
