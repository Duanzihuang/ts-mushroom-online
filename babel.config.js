// 生产阶段要用到的babel插件
const prodPlugins = []
// 开发阶段要用到的babel插件
const devPlugins = []

if (process.env.NODE_ENV === 'production') {
  prodPlugins.push('transform-remove-console')
} else {
  devPlugins.push(
    'import',
    {
      libraryName: 'vant',
      libraryDirectory: 'es',
      style: true
    },
    'vant'
  )
}

// 是否是生产环境
const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  presets: ['@vue/cli-plugin-babel/preset'],
  plugins: [isProd ? prodPlugins : devPlugins,'@babel/plugin-syntax-dynamic-import']
}
