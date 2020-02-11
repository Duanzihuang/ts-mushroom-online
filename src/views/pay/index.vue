<template>
  <div class="pay-container">
    <!-- NavBar -->
    <nav-bar title="支付" />
    <!-- 订单详情 -->
    <div class="order-info">
      <img :src="coverImageUrl" alt />
      <div class="name">
        <p>{{ title }}</p>
        <p>永久观看</p>
      </div>
      <div class="price">{{ price }}</div>
    </div>
    <!-- 支付方式 -->
    <div class="pay-style">
      <p>支付方式</p>
      <div class="wx-pay">
        <img src="../../assets/images/wx_pay_logo@2x.png" alt="" />
        <div class="name">
          <p>微信支付</p>
          <p>微信安全支付</p>
        </div>
        <img
          class="select-image"
          src="../../assets/images/selected@2x.png"
          alt=""
        />
      </div>
    </div>
    <p class="tip">
      注：该订单不支持退款、提交订单则表示您同意《用户付款协议》
    </p>
    <div class="bottom">
      <div class="content">
        <p>实付金额</p>
        <p>￥{{ price }}</p>
        <img
          @click="orderAndPay"
          class="pay"
          src="../../assets/images/wx_pay@2x.png"
          alt
        />
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
      coverImageUrl: null, // 封面图
      title: null, // 标题
      price: null // 价格
    }
  }
  created() {
    this.coverImageUrl = this.$route.query.cover_image_url
    this.title = this.$route.query.title
    this.price = this.$route.query.price
  }
  orderAndPay() {
    this.createOrder()
  }
  async createOrder() {
    const res = await this.$axios.post('order/create', {
      ['course_id']: this.$route.query.id,
      price: this.price
    })

    if (res.data.status === 0) {
      // 模拟支付
      this.payOrder(res.data.order_id)
    }
  }
  async payOrder(orderId) {
    const res = await this.$axios.post('order/pay', {
      ['order_id']: orderId
    })

    if (res.data.status === 0) {
      this.$toast({
        type: 'success',
        message: res.data.message,
        duration: 800,
        onClose: () => {
          this.$router.back()
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.pay-container {
  height: 100%;
  width: 375px;
  .order-info {
    background-color: #ffffff;
    display: flex;
    width: 375px;
    height: 136px;
    align-items: center;
    border-bottom: 1px solid #f6f6f6;
    img {
      padding-left: 16px;
      width: 150px;
      height: 100px;
    }
    .name {
      align-self: flex-start;
      margin-top: 15px;
      margin-left: 15px;
      flex: 1;
      p:nth-child(1) {
        margin-top: 10px;
        color: #343434;
        font-size: 19px;
        display: block;
        font-weight: bolod;
      }
      p:nth-child(2) {
        margin-top: 10px;
        color: #a8a8a8;
        font-size: 12px;
      }
    }
    .price {
      align-self: flex-end;
      margin-bottom: 15px;
      color: #ee3939;
      font-size: 16px;
      font-weight: bold;
      padding-right: 16px;
    }
  }
  .pay-style {
    width: 375px;
    height: 205px;
    background-color: #ffffff;
    p:nth-child(1) {
      padding-left: 16px;
      height: 50px;
      line-height: 50px;
      border-bottom: 1px solid#F6F6F6;
      color: #343434;
      font-size: 16px;
    }
    .wx-pay {
      height: 100px;
      align-items: center;
      display: flex;
      // justify-content: space-between;
      img:nth-child(1) {
        padding-left: 16px;
        width: 19px;
        height: 17px;
      }
      .select-image {
        width: 18px;
        height: 18px;
        align-content: flex-end;
        padding-right: 16px;
      }
      .name {
        flex: 1;
        margin-left: 20px;
        p:nth-child(1) {
          color: #333333;
          display: block;
          font-size: 16px;
          padding-left: 0;
        }
        p:nth-child(2) {
          color: #a8a8a8;
          font-size: 11px;
          margin-top: 5px;
        }
      }
    }
  }
  .tip {
    position: absolute;
    color: #dbdbdb;
    width: 375px;
    text-align: center;
    font-size: 10px;
    bottom: 140px;
  }
  .bottom {
    width: 375px;
    height: 107px;
    position: fixed;
    bottom: 0;
    .content {
      align-items: center;
      display: flex;
      height: 107px;
      background-color: #fff;
      p:nth-child(1) {
        padding-left: 16px;
        color: #a2a2a2;
        font-size: 12px;
      }
      p:nth-child(2) {
        color: #ee3939;
        font-size: 20px;
        margin-left: 10px;
        font-weight: bold;
      }
      .pay {
        margin-left: 40px;
        width: 164px;
        height: 46px;
      }
    }
  }
}
</style>
