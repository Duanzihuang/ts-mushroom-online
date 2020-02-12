<template>
  <div class="course-container">
    <router-link
      :to="'course-detail?id=' + item.id"
      class="course-item"
      v-for="item in courses"
      :key="item.id"
    >
      <img :src="item.icon" alt />
      <p class="title">{{ item.title }}</p>
      <p class="subtitle">{{ item.subtitle }}</p>
      <p class="level" v-if="item.level === 1">初级</p>
      <p class="level" v-else-if="item.level === 2">中级</p>
      <p class="level" v-else-if="item.level === 3">高级</p>
    </router-link>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class CourseList extends Vue {
  @Prop({ type: Array, default: [] }) courses!: Array<any>
}
</script>

<style lang="scss" scoped>
.course-container {
  display: flex;
  flex-wrap: wrap;
  padding-bottom: 16px;
}
.course-item {
  margin-left: 16px;
  margin-top: 16px;
  border-radius: 12px;
  background-color: white;
  width: 166.5px;
  height: 184px;
  display: flex;
  flex-direction: column;
  align-items: center;
  img {
    margin-top: 29px;
    width: 62px;
    height: 62px;
  }
  .title {
    margin-top: 14px;
    color: #333333;
    font-weight: bold;
    font-size: 16px;
  }
  .subtitle {
    color: #a8a8a8;
    font-size: 11px;
    margin-top: 6px;
  }
  .level {
    margin-top: 10px;
    color: #ffb37a;
    text-align: center;
    font-size: 12px;
    line-height: 16px;
    width: 46px;
    height: 16px;
    border: 2px solid rgba(255, 179, 122, 1);
    opacity: 1;
    border-radius: 16px;
  }
}
</style>
