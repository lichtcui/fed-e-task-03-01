# 虚拟 DOM
用 js 对象描述 dom 对象，创建虚拟 dom 的开销比真实 dom 小很多

- 简化 DOM 的复杂操作，MVVM 框架解决了视图和状态的同步问题
- 当状态改变时，不需要立即更新 DOM，在 Virtual DOM 中处理 diff 更新 DOM

#### 作用
- 维护视图和状态的关系
- 复杂视图情况下提升渲染性能
- 实现 SSR (Nuxt.js/Next.js)、原生应用(Weex/React Native)、小程序(mpvue/uni-app)