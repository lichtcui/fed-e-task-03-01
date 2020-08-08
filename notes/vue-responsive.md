# Vue Responsive

## 数据响应式

数据模型仅仅是普通的 JavaScript 对象，当修改数据时，视图会进行更新，避免繁琐的 DOM 操作，提高开发效率

```js
// 模拟 vue 中的 data 成员
let data = { msg: 'hello' }

// 模拟 vue 实例
let vm = {}

// 数据劫持：当访问活着设置 vm 中的成员的时候，做一些干预操作
object.defineProperty(vm, 'msg', {
  // 可枚举（可遍历）
  enumerable: true,
  // 可配置（可使用 delete 删除，可以通过 defineProperty 重新定义）
  configurable: true,
  // 获取值的时候执行
  get () {
    console.log('get', data.msg)
    return data.msg
  },
  // 设置值改变时执行
  set (newValue) {
    console.log('set:', newValue)
    if (newValue === data.msg) { return }
    data.msg = newValue
    // 数据更改，更新 DOM 的值
    document.querySelector('#app'.textContent = data.msg)
  }
})

// 测试
vm.msg = 'hello world'
console.log(vm.msg)
```

vue 3.x

```js
let data = {
  msg: 'hello',
  count: 0
}

let vm = new Proxy(data, {
  get (target, key) {
    console.log('get,key:', key, target[key])
    return target[key]
  }
  set (target, key, newValue) {
    console.log('set,key:', key, newValue)
    if (target[key] === newValue) {
      return
    }
    target[key]= newValue
    document.querySelector('#app').textContent = target[key]
  }
})

vm.msg = 'hello world'
console.log(vm.msg)
```

#### 发布/订阅模式
- 订阅者
- 发布者
- 信号中心

自定义事件
```js
// 事件中心
let eventHub = new Vue()

// 发布者
addTodo: function () {
  // 发布消息（事件）
  eventHub.$emit('add-todo', { text: this.newTodoText})
  this.newTodoText = ''
}

// 订阅者
created: function () {
  //  订阅消息（事件）
  eventHub.$on('add-todo', this.addTodo)
}
```

#### 观察者模式
- 观察者（订阅者）-- watcher
- update() 当事件发生时，具体要做的事情

- 目标（发布者）--dep
  - subs 数组：存储所有的观察者
  - addSub()：添加观察者 
  - notify()：当事件发生，调用所有观察者的 update() 方法
- 没有事件中心
- 双向绑定
  - 数据改变，试图改变；视图改变，数据也随之改变
  - 可以使用 v-model 在表单元素上创建双向数据绑定
- 数据驱动
  - 开发过程中仅需要关注数据本身，不需要关心数据如何渲染到视图

## 整体分析
- vue
  - 记录传入选项，设置 data / el
  - 把 data 注入 vue 实例
  - 调用 Observer 实现响应式数据处理
  - 调用 Compiler 编译指令/插值表达式
- observer
  - 把 data 中的成员转换成 getter/setter
  - 把多层属性转换成 getter/setter
  - 如果给属性赋值成新对象，把新对象成员设置为 getter/setter
  - 添加 Dep 和 Watcher 的依赖关系
  - 数据变化发送通知
- Compiler
  - 负责编译模版，解析指令/差值表达式
  - 负责页面首次渲染过程
  - 数据变化后重新渲染
- Dep
  - 收集依赖，添加订阅者(Watcher)
  - 通知所有订阅者
- Watcher
  - 自身实例化时，往 Dep 对象中添加自己
  - 数据变化时 Dep 通知所有的 Watcher 实例更新视图
