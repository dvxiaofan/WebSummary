// 将 async/await 转换成 es5 代码后需要这个运行时库来支持
import 'regenerator-runtime/runtime'


const routes = {
  '/foo': () => import('./views/foo'),
  '/bar.do': () => import('./views/bar.do')
}

// Router类, 用来控制页面根据当前URL切换
class Router {
  start() {
    // 点击浏览器后退/前进按钮时会触发window.onpopstate事件, 我们在这时切换到相应页面
    // https://developer.mozilla.org/en-US/docs/Web/Events/popstate
    window.addEventListener('popstate', () => {
      this.load(location.pathname)
    })

    // 打开页面时加载当前页面
    this.load(location.pathname)
  }

  // 前往path, 变更地址栏URL, 并加载相应页面
  go(path) {
    // 变更地址栏URL
    history.pushState({}, '', path)
    // 加载页面
    this.load(path)
  }

  // 加载path路径的页面
  async load(path) {
    // 首页
    if (path === '/') path = '/foo'
    // 动态加载页面
    const View = (await routes[path]()).default

    // 创建页面实例
    const view = new View()
    // 调用页面方法, 把页面加载到document.body中
    view.mount(document.body)
  }
}

// 导出router实例
export default new Router()
