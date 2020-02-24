<template>
  <div class="phone-login-container">
    <p class="phone-validate">手机号验证</p>
    <p class="subtitle">用于即使获取课程最新信息</p>
    <div class="content">
      <input v-model="phone" class="phone" placeholder="请输入您的手机号" type="number" />
      <div @click="getVcode" class="get_vcode" :style="{ color: isCountDown ? '#ccc' : 'black' }">
        {{ tips }}
      </div>
      <input v-model="vcode" class="vcode" placeholder="请输入验证码" type="number" />
    </div>
    <div class="phone-login">
      <img @click="phoneLogin" src="../../assets/images/phone_login@2x.png" alt />
    </div>
  </div>
</template>

<script lang="ts">
import loginMixin from '../../mixins/login'
import { Component, Vue, Mixins } from 'vue-property-decorator'

@Component
export default class PhoneLogin extends Mixins(loginMixin) {
  phone = '17704051019'
  vcode = ''
  count = 10
  tips = '获取验证码'
  isCountDown = false
  timer = -1

  async getVcode() {
    if (this.phone.trim().length === 0) {
      this.$toast({
        message: '手机号不能为空',
        icon: 'none',
        duration: 1000
      })
      return
    }
    // 正则校验
    const reg = /^1[3456789][0-9]{9}$/
    if (!reg.test(this.phone)) {
      this.$toast({
        message: '手机号不合法',
        icon: 'none',
        duration: 1000
      })
      return
    }
    // 正在倒计时
    if (this.isCountDown) return
    this.isCountDown = true
    this.tips = `${this.count}`
    this.timer = setInterval(() => {
      if (this.count <= 1) {
        this.isCountDown = false
        this.count = 10
        this.tips = '获取验证码'
        // 清除定时器
        clearInterval(this.timer)
        return
      }
      this.count--
      this.tips = `${this.count}`
    }, 1000)
    const result = await (this as any).$axios.get('user/vcode', {
      params: {
        phone: this.phone
      }
    })

    if (result.data.status === 0) {
      this.$toast({
        message: `${result.data.vcode}`,
        icon: 'none',
        duration: 1000
      })
    }
  }

  // 手机号登录
  async phoneLogin() {
    const result = await (this as any).$axios.post('user/login', {
      phone: this.phone,
      vcode: this.vcode
    })

    this.loginHandle(result)
  }

  // 退出时，销毁定制器
  beforeDestroy() {
    clearInterval(this.timer)
  }
}
</script>

<style lang="scss" scoped>
.phone-login-container {
  padding: 0px 34px;
  .phone-validate {
    margin-top: 50px;
    color: #393939;
    font-size: 21px;
  }
  .subtitle {
    margin-top: 10px;
    color: #a8a8a8;
    font-size: 15px;
  }
  .content {
    margin-top: 100px;
    height: 125px;
    position: relative;
    .phone {
      height: 50px;
      font-size: 15px;
      display: block;
      position: relative;
      border: none;
      background-color: #f8f8f8;
      border-bottom: 1px solid #e9e9e9;
      width: 100%;
    }
    .get_vcode {
      position: absolute;
      right: 0;
      top: 10px;
      width: 82px;
      height: 28px;
      text-align: center;
      line-height: 28px;
      font-size: 12px;
      color: #a8a8a8;
      border: 1px solid rgba(168, 168, 168, 1);
      border-radius: 10px;
      z-index: 2;
    }
    .vcode {
      margin-top: 25px;
      height: 50px;
      width: 100%;
      font-size: 12px;
      position: relative;
      display: block;
      border: none;
      background-color: #f8f8f8;
      border-bottom: 1px solid #e9e9e9;
    }
  }
  .phone-login {
    margin-top: 160px;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      width: 284px;
      height: 49px;
    }
  }
}
</style>
