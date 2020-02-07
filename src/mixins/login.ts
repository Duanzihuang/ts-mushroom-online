import { Toast, Dialog } from 'vant'

import { Component, Vue } from 'vue-property-decorator'

@Component
export default class LoginMixins extends Vue {
  loginHandle(res: any) {
    if (res.data.status === 0) {
      // 登录成功之后的提示
      Toast({
        message: res.data.message,
        icon: 'none',
        duration: 500
      })
      // 保存token
      localStorage.setItem('my_token', res.data.token)
      // 跳转到首页
    } else {
      Dialog.alert({
        title: '提示',
        message: res.data.message
      })
    }
  }
}
