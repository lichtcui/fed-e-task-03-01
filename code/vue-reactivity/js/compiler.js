class Compiler {
  constructor (vm) {
    this.el = vm.$el
    this.vm = vm
    this.compile(this.el)
  }

  // 编译模板，处理文本节点和元素节点
  compile (el) {
    let childNodes = el.childNodes
    Array.from(childNodes).forEach(node => {
      // 处理文本节点
      if (this.isTextNode(node)) { this.compileText(node) }
      // 处理元素节点
      else if (this.isElementNode(node)) { this.compileElement(node) }
      // 判断node节点，是否有子节点，如果有子节点，要递归调用compile
      if (node.childNodes && node.childNodes.length) { this.compile(node) }
    })
  }

  // 编译元素节点，处理指令
  compileElement (node) {
    Array.from(node.attributes).forEach(attr => {
      let attrName = attr.name
      // 判断是否是指令
      if (this.isDirective(attrName)) {
        // v-text --> text
        attrName = attrName.substr(2)
        let key = attr.value
        this.update(node, key, attrName)
      }
    })
  }

  // 使用对应的 Updater
  update (node, key, attrName) {
    // v-on:click="onClick"
    // v-on="{mouseenter:onEnter,mouseout:onOut}
    if (attrName.startsWith('on')) {
      const events = attrName.startsWith('on:')
        ? [].concat([attrName.replace('on:', ''),key].join(':'))
        : key.slice(1, key.length - 1).split(',')
      return this.onEventsUpdater(node, this.vm.$method, events)
    }

    let updateFn = this[attrName + 'Updater']
    updateFn && updateFn.call(this, node, this.vm[key], key)
  }

  // v-text
  textUpdater (node, value, key) {
    node.textContent = value
    new Watcher(this.vm, key, (newValue) => { node.textContent = newValue })
  }

  // v-model
  modelUpdater (node, value, key) {
    node.value = value
    new Watcher(this.vm, key, (newValue) => { node.value = newValue })
    // 双向绑定
    node.addEventListener('input', () => { this.vm[key] = node.value })
  }

  // v-html
  htmlUpdater (node, value, key) {
    node.innerHTML = value
    new Watcher(this.vm, key, (newValue) => { node.innerHTML = newValue })
  }

  // v-on
  onEventsUpdater (node, values, keys) {
    keys.forEach(i => {
      const [event, fnName] = i.split(':')
      node.addEventListener(event, values[fnName])
    })
  }

  // 编译文本节点，处理差值表达式
  compileText (node) {
    // 匹配差值表达式{{  msg }}
    let reg = /\{\{(.+?)\}\}/
    // 获取文本内容
    let value = node.textContent
    if (reg.test(value)) {
      // 匹配后去除空格
      let key = RegExp.$1.trim()
      // 把差值表达式替换成值
      node.textContent = value.replace(reg, this.vm[key])
      // 创建watcher对象，当数据改变更新视图
      new Watcher(this.vm, key, (newValue) => { node.textContent = newValue })
    }
  }

  // 判断元素属性是否是指令
  isDirective (attrName) {
    return attrName.startsWith('v-')
  }
  // 判断节点是否是文本节点
  isTextNode (node) {
    return node.nodeType === 3
  }
  // 判断节点是否是元素节点
  isElementNode (node) {
    return node.nodeType === 1
  }
}