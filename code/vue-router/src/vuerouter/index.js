let _Vue = null

export default class VueRouter {
  static install (Vue) {
    // 插件已安装直接返回
    if (VueRouter.install.installed && _Vue === Vue) { return }
    VueRouter.install.installed = true
    // 把 vue 构造函数记录到全局变量
    _Vue = Vue
    // 把创建 Vue 实例时候 传入的 router 对象注入到 Vue 实例上
    Vue.mixin({
      beforeCreate () {
        // 判断 router 对象是否已经挂载到 Vue 实例上
        if (this.$options.router) {
          // 把 router 对象注入到 Vue 实例上
          _Vue.prototype.$router = this.$options.router
          // 初始化插件的时候，调用 init
          this.$options.router.init()
        }
      }
    })
  }

  constructor (options) {
    this.options = options
    // 记录路径和对应组件
    this.routeMap = {}
    this.data = _Vue.observable({
      current: '/'
    })
  }

  init () {
    this.createRouteMap()
    this.initEvents()
    this.initComponents(_Vue)
  }

  createRouteMap () {
    // routes => [{ name: '', path: '', component: '' }]
    // 遍历所有路由信息，记录路径和组件的映射
    this.options.routes.forEach(route => {
      // 记录路径和组件的映射关系
      this.routeMap[route.path] = route.component
    })
  }

  initEvents () {
    // 当路径变化后，重新获取当前路径并记录到 current
    window.addEventListener('hashchange', this.onHashChange.bind(this))
    window.addEventListener('load', this.onHashChange.bind(this))
  }

  initComponents (Vue) {
    Vue.component('router-link', {
      props: {
        to: String
      },
      // 需要带编译器版本的 Vue.js 向 vue.config.js 添加 runtimeCompiler: true
      template: "<a :href='\"#\" + to'><slot></slot></a>"
    })

    const self = this
    Vue.component('router-view', {
      render (h) {
        const component = self.routeMap[self.data.current]
        return h(component)
      }
    })
  }

  onHashChange () {
    this.data.current = window.location.hash.substr(1) || '/'
  }
}
