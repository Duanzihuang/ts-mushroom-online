// 参考：https://www.cnblogs.com/lml2017/p/9953429.html
// https://youzan.github.io/vant/#/zh-CN/quickstart#postcss-pei-zhi
module.exports = {
  plugins: {
    autoprefixer: {
      browsers: ['Android >= 4.0', 'iOS >= 8']
    },
    'postcss-pxtorem': {
      rootValue: 37.5,
      propList: ['*']
    }
  }
}
