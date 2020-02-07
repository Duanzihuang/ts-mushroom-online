<template>
  <div class="login-container">
    <img class="logo" src="../../assets/images/logo@2x.png" alt />
    <p class="title">蘑菇在线</p>
    <img class="login-tips" src="../../assets/images/login_tips@2x.png" alt />
    <img class="wx-login-img" src="../../assets/images/wx_login@2x.png" alt />
    <p @click="phoneLogin" class="phone-login">手机号登录</p>
    <p class="bottom-tip">Copyright © 2019 蘑菇在线</p>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class Login extends Vue {
  phoneLogin() {
    this.$router.push('/phone-login')
  }
}
</script>

<style lang="scss" scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  .logo {
    margin-top: 50px;
    width: 106px;
    height: 106px;
  }
  .title {
    color: #333333;
    font-size: 12px;
    margin-top: 10px;
  }
  .login-tips {
    margin-top: 15px;
    height: 17px;
    width: 146px;
    position: relative;
  }
  .wx-login-button {
    margin-top: 100px;
    width: 284px;
    height: 49px;
    padding: 0;
    border: none;
  }
  .wx-login-img {
    margin-top: 100px;
    width: 284px;
    height: 49px;
  }
  .phone-login {
    margin-top: 20px;
    color: #333333;
    font-size: 15px;
  }
  .bottom-tip {
    color: #a8a8a8;
    font-size: 10px;
    position: absolute;
    bottom: 30px;
  }
}
</style>
