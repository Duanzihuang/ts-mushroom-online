# ts-mushroom-online

## 项目简介
```
使用typescript + vue 构建的在线学习App，蘑菇在线
```

## 涉及的技术点

1. typescript
2. vue
3. vuex
4. vue-router（history模式）
5. minix
6. slot
7. vant（做了屏幕适配）
8. axios

## Vue项目打包优化

> 注意：本教程是针对@vue/cli3.x及以上，要更改webpack的配置进行优化。
>
> 必须在项目根目录下创建一个 `vue.config.js`并且写好配置

vue.config.js 文件代码结构如下

```json
module.exports = {
    //里面写上配置，对Vue项目进行优化配置
}
```

### 优化步骤

1. 通过externals加载外部CDN资源【别忘记在public.html中通过CDN的方式引入所需要的css、js文件】

   ```js
   1.1、删除掉 main-prod.ts 中引入的css文件
   
   1.2、在`vue.config.js`中配置externals
   // 生产环境中配置 externals
   config.set('externals', {
     vue: "Vue",
     'vue-router': "VueRouter",
     vuex: "Vuex",
     axios: "axios",
     vant: 'vant'
   })
   
   1.3、在public/index.html中引入所需要的css文件和js文件【只有在生产模式下，才需要引入】
   ```

2. Vant/ElementUI的打包优化

   ```js
   2.1 更改`babel.config.js` 中的按需引入代码，改成只有在开发阶段才按需导入
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
   
   2.2 在`vue.config.js` 中设置htmlWebpackPlugin的属性值
   // 开发模式
   config.when(process.env.NODE_ENV === 'development', config => {
     config.plugin('html').tap(args => {
       args[0].isProd = false
       return args
     })
   })
   
   2.3 在`public/index.html`中，在生产模式下引入vant/ElementUI的样式和js文件
   <html lang="en">
   	 <title><%= htmlWebpackPlugin.options.isProd ? '' : 'dev - ' %>蘑菇在线</title>
       <% if (htmlWebpackPlugin.options.isProd) { %>
       <!-- 引入样式文件 -->
       <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/vant@2.4/lib/index.css">
       <!-- 引入js文件 -->
       <script type="text/javascript" src="https://unpkg.com/vue@2.6.11/dist/vue.min.js"></script>
       <script type="text/javascript" src="https://unpkg.com/vue-router@3.1.5/dist/vue-router.min.js"></script>
       <script type="text/javascript" src="https://unpkg.com/vuex@3.1.2/dist/vuex.min.js"></script>
       <script type="text/javascript" src="https://cdn.bootcss.com/axios/0.19.2/axios.min.js"></script>
       <script src="https://cdn.jsdelivr.net/npm/vant@2.4/lib/vant.min.js"></script>
       <% } %>
   </html>
   ```

3. 路由懒加载

   ```js
   3.1 安装 @babel/plugin-syntax-dynamic-import 包
   	npm i @babel/plugin-syntax-dynamic-import
     
   3.2 在`babel.config.js`中声明该插件
   module.exports = {
     presets: ['@vue/cli-plugin-babel/preset'],
     plugins: [isProd ? prodPlugins : devPlugins,'@babel/plugin-syntax-dynamic-import']
   }
   
   3.3 将路由改为按需加载的形式
   const Login = () => import(/* webpackChunkName: "login" */ '../views/login/index.vue')
   ...
   
   参考：https://router.vuejs.org/zh/guide/advanced/lazy-loading.html
   ```

## Vue项目部署

### 使用Node创建Web服务器

```js
可以使用Express或是Koa来开启Web服务，详情参考 server 目录下面的`app.js`代码

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
```

### 开启gzip配置

```js
好处：可以减少文件体积，使传输速度更快。

const compress = require('koa-compress')
// 开启gzip压缩，注意，这个中间件一定要写在静态资源代码托管之前，否则不起作用
app.use(compress())

Express代码参考：
https://www.npmjs.com/package/compression
```

### 配置https服务

```js
好处：传输比http更加安全
免费ssl证书申请网站：https://freessl.org/
阿里云ssl证书申请：https://yundun.console.aliyun.com  注意：需要自己有域名

freessl步骤：
	1、进入 https://freessl.org/ 官网，输入要申请的域名并选择品牌
	2、输入自己的邮箱并选择相关选项
  3、验证DNS（在域名管理后台添加TXT记录）
  4、验证通过之后，下载SSL证书（full_chain.pem 公钥,private.key私钥）

使用参考：
	https://jingyan.baidu.com/article/2c8c281d8cfb8c0009252a73.html

阿里云步骤：
	1、申请
  2、下载（下载Nginx版本的证书，能够适用于Node）

koa代码：
	const https = require('https')
	const fs = require('fs')
  
  // SSL options
  var options = {
      key: fs.readFileSync(path.join(__dirname,'./ssl/www.huangjiangjun.top.key')),  //ssl文件路径
      cert: fs.readFileSync(path.join(__dirname,'./ssl/www.huangjiangjun.top.pem'))  //ssl文件路径
  }
	
  // 开启HTTPS服务
  https.createServer(options, app.callback()).listen(443,function() {
      console.log(`server is running port 443`)
  })
```

### 使用PM2管理Node应用

```yml
好处：在终端(cmd)关闭之后，我们的node项目依然能够访问
前提：全局安装 pm2 指令   npm i pm2 -g

命令：
	启动项目：pm2 start 脚本 --name 自定义名称
	查看项目：pm2 list
	重启项目：pm2 restart 自定义名称
	停止项目：pm2 stop 自定义名称
	删除项目：pm2 delete 自定义名称
	查看日志：pm2 log 自定义名称
	
配置文件启动
	在项目根目录写好配置文件：pm2.yml
	apps:
  - script: ./src/app.js
    name: mushroom-online-server
    env_production:
      NODE_ENV: production
      HOST: localhost
      PROT: 8888
      
  启动：pm2 start pm2.yml --env production
```

