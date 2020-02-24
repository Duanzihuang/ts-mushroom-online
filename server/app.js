// 引入koa
const koa = require('koa')
const path = require('path')
const compress = require('koa-compress')
const https = require('https')
const fs = require('fs')
const { historyApiFallback } = require('koa2-connect-history-api-fallback')

// 创建app
const app = new koa()

// use historyApiFallback
app.use(historyApiFallback({ whiteList: ['/api'] }))

// 开启gzip压缩，注意，这个中间件一定要写在静态资源代码托管之前，否则不起作用
app.use(compress())

// 导入静态资源
const static = require('koa-static')

// 使用静态资源
app.use(static(path.join(__dirname, '../dist')))

// 开启服务器
app.listen(80, function() {
  console.log(`server is running port 80`)
})

// SSL options
var options = {
  key: fs.readFileSync(path.join(__dirname, './ssl/www.huangjiangjun.top.key')), //ssl文件路径
  cert: fs.readFileSync(path.join(__dirname, './ssl/www.huangjiangjun.top.pem')) //ssl文件路径
}

// 开启HTTPS服务
https.createServer(options, app.callback()).listen(443, function() {
  console.log(`server is running port 443`)
})
