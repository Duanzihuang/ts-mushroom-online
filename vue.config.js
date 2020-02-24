module.exports = {
  // publicPath: "./",
  // devServer: {
  //   proxy: {
  //     // 设置代理
  //     '/api': {
  //       target: 'http://localhost:3000/',
  //       changeOrigin: true
  //     }
  //   }
  // }
  chainWebpack: config => {
    // 发布模式
    config.when(process.env.NODE_ENV === 'production', config => {
      config
        .entry('app')
        .clear()
        .add('./src/main-prod.ts')

      config.plugin('html').tap(args => {
        args[0].isProd = true
        return args
      })

      // 生产环境中配置 externals
      config.set('externals', {
        vue: 'Vue',
        'vue-router': 'VueRouter',
        vuex: 'Vuex',
        axios: 'axios',
        vant: 'vant'
      })
    })

    // 开发模式
    config.when(process.env.NODE_ENV === 'development', config => {
      config.plugin('html').tap(args => {
        args[0].isProd = false
        return args
      })
    })
  }
}
