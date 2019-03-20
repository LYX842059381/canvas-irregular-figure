import Painter from './Painter'
import G from './models/G'

/**
 * 安全的监听方法
 */
// const safeEvent = [
//   'mousemove',
//   'click'
// ]
/**
 * Map
 * 绘制基本对象,绑定 canvas
 */
export default class Map {
  w: number // 宽度
  h: number // 高度
  fr: HTMLElement // 容器
  el: HTMLCanvasElement // canvas
  C: CanvasRenderingContext2D // context
  dpr: number // dpr值
  nodes: Array<any> // 子节点内容
  mouse: any // 鼠标状态
  observerList: Array<G> // 观察者
  focus: G // 焦点节点
  view: { // 视图区域
    x: 0,
    y: 0,
    w: number,
    h: number
  }
  listener: { // 可用监听（未完全）
    mousemove: Array<Function>
  }
  constructor(id: string, dpr: number = 1) {
    this.fr = document.getElementById(id)
    this.el = document.createElement('canvas')
    this.view = {
      x: 0,
      y: 0,
      w: this.fr.offsetWidth,
      h: this.fr.offsetHeight
    }
    this.el.width = this.fr.offsetWidth * dpr
    this.w = this.fr.offsetWidth
    this.el.height = this.fr.offsetHeight * dpr
    this.h = this.fr.offsetHeight
    this.dpr = dpr
    this.el.style.width = '100%' // this.fr.offsetWidth + 'px'
    this.el.style.height = '100%' // this.fr.offsetHeight + 'px'
    this.fr.appendChild(this.el)
    this.C = this.el.getContext('2d')
    this.C.translate(.5, .5)
    this.C.imageSmoothingEnabled = true;
    this.C.scale(dpr, dpr)
    this.nodes = []
    this.observerList = []
    this.mouse = {}
    // this.el.addEventListener('mousemove', () => { this.handleMousemove(event) })
  }
  /**
   * 基础渲染方法
   * @param clear 是否清除内容
   */
  render(clear: boolean = true) {
    const { nodes, C, w, h, view } = this
    clear && C.clearRect(view.x - 1, view.y - 1, w + 1, h + 1)
    for(let node of nodes) {
      Painter.draw(C, node.tag, node)
    }
  }
  /**
   * 可视区域移动
   * @param x x
   * @param y y
   */
  viewMove(x: number, y: number) {
    this.view.x += x
    this.view.y += y
    this.C.translate(-x, -y)
  }
  /**
   * 添加子节点
   * @param args 
   */
  add(...args) {
    this.nodes.push(...args)
    // [...args].forEach(item => {
    //   item.parent = this
    // })
  }
  /**
   * 移除节点
   * @param obj 节点
   */
  remove(obj: any) {
    let i = this.nodes.indexOf(obj)
    i !== -1 && this.nodes.splice(i, 1)
  }
  /**
   * 清空子节点内容
   */
  clear() {
    const { C, w, h, view } = this
    C.clearRect(view.x, view.y, w, h)
    this.C.translate(view.x, view.y)
    this.nodes = []
    this.view.x = 0
    this.view.y = 0
  }
  /**
   * 获取焦点的方法
   * @param mouse 鼠标位置
   * @param observerList 监听列表
   */
  static getFocusNode(mouse: {x: number, y: number}, observerList: Array<G>) {
    let temp
    const { x, y} = mouse
    for(let i = 0; i < observerList.length; i++) {
      let _o = observerList[i]
      if(_o.left > x ) continue
      if(_o.left + _o.w < x ) continue
      if(_o.top > y ) continue
      if(_o.top + _o.h < y ) continue
      temp = _o
      break      
    }
    return temp
  }
  // 注册监听
  addEventListener(trig: string, fn: Function) {
    if(!(this.listener.hasOwnProperty(trig))) return
    this.listener[trig].push(fn)
  }
  /**
   * 鼠标滑动事件
   * @param e 事件
   */
  handleMousemove(e) {
    if (!e) return
    const { observerList, listener } = this
    const _self = this
    this.mouse.x = e.layerX
    this.mouse.y = e.layerY
    listener['mousemove'].forEach(fn => {
      fn()
    })
    let focus = Map.getFocusNode(this.mouse, observerList)
    if(this.focus && focus !== this.focus) this.focus.onBlur()
    if(focus) {
      this.focus = focus
      focus.onFocus()
    } else {
      this.focus && this.focus.onBlur()
      this.focus = null
    }    
    this.render()
  }
}