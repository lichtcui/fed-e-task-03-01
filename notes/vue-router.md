# Vue Router

## 使用步骤
- 创建路由相关视图
- 注册路由插件  
  Vue.use 用来注册插件，会调用传入对象的 install 方法
- 创建路由对象  
  通过 new VueRouter 创建路由对象（传入路由规则）
- 导出路由对象
- main.js 中导入路由对象 router，在创建 Vue 实例的过程中，注册 router 对象  
  注入 $route 当前路由数据：路径，参数等 $router 路由对象，提供方法，push replace等
- app.view 中创建 router-view （创建路由组件的占位）

## 动态路由
通过占位匹配对应位置
```js
// router
{
  // :id 占位符，使用时传入对应 id
  path: 'detail/:id',
  name: 'Detail',
  // 开启 props，会把 url 中的参数传递给组件，
  // 组件中通过 props 接收 url 参数
  props: true,
  // 动态加载
  component: () => import(/* webpackChunkName: "detail" */ '../views/Detail.vue')
}
```

```html
<!-- views/Detail.vue -->
<template>
  <div class="detail">
    <!-- 1.通过当前路由规则，获取数据 -->
    <!-- 这种写法强依赖路由，必须有路由传递相应参数 -->
    通过当前路由规则获取：{{ $route.params.id }}
    <br>
    <!-- 2.通过路由规则中开启 props 传参 -->
    通过开启 props 获取：{{ id }}
  </div>
</template>

<script>
export default { name: 'Detail', props: ['id'] }
</script>
```

## 嵌套路由
```js
{
  { path: '/', ... },
  {
    path: '/home',
    // 公共部分，内部添加 <router-view></router-view>
    component: Home,
    children: [
      { path: 'home/about', ... },
      { path: 'home/detail', ... }
    ]
  }
}
```

## 编程式导航
```js
// 跳转，并记录历史 (接收字符串或对象名称)
this.$router.push('/')
// this.$router.push({ name: 'Index' })

// 跳转，但不记录历史
this.$router.replace('login')

// 跳转回上上个页面
this.$router.go(-2)
```

## Hash 和 History 模式区别
- hash
  - https://music.163.com/#/... URL 中 # 后面的内容作为路径地址
  - 基于锚点，监听 hashchange 事件
  - 根据当前路由地址找到对应组件重新渲染
- history
  - https://music.163.com/...
  - 基于 html5 中的 History API
  - history.pushState() IE 10 以后才支持
  - history.replaceState()
  - 监听 popstate 事件
  - 根据当前路由地址找到对应组件重新渲染

## History 模式
- 需要服务器支持
- 单页应用中，服务端不存在 http://www.163.com/login 这样的地址会返回找不到该页面
- 在服务端应该除了静态资源外都返回单页应用的 index.html

### Node 中配置 history
```js
const path = require("path")
const history = require("connect-history-api-fallback")
const express = require("express")

const app = express()
// 注册处理 history 模式的中间件
// 处理 viewRouter 中的 history 模式
app.use(history())

// 处理静态资源的中间件，网站根目录 ../web
app.use(express.static(path.join(__dirname, "../web")))

// 开启服务器，监听 3000 端口
app.listen(3000, () => {
	console.log("Server start, port: 3000")
})
```
- 开启服务器支持时，刷新页面后向 localhost:3000/about 发送请求
- 服务器接收到请求后，因为开启了 history 模式的支持，服务器会判断请求的页面是否存在，会把默认的首页 index.html 返回给浏览器
- 浏览器接收到后会再去判断地址是 about，并渲染到浏览器

### Nginx 中配置 history

brew services restart nginx
nginx -s reload
nginx -s stop

> /usr/local/etc/nginx/nginx.conf
```
location / {
    root   /Users/lichtcui/Downloads/web;
    index  index.html index.htm;
    try_files $uri $uri/ /index.html;
}
```