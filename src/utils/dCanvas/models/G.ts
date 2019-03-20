import vNode from '../VNode'
import Painter from '../Painter'
interface g {
  left?: number
  top?: number
  w?: number
  h?: number
  deg?: number
  clip?: boolean
  c?: string
  onFocus?: Function
  fill?: boolean
  stroke?: boolean
}
/**
 * 容器组件
 * @constructor 
 */
export default class G extends vNode{
  left:number = 0
  top: number = 0
  w: number = 0
  h: number = 0
  deg:number = 0 // 旋转的角度
  center: [number, number] = [0, 0] // 相对中心点
  children: Array<vNode> // 子节点
  c!: string; // 颜色
 // 颜色
  private _c: string // 初始化的颜色
  fill: boolean = false // 是否填充区域
  stroke: boolean = false // 是否描边
  clip: boolean = false // 是否裁切区域
  constructor(obj:g = {}) {
    super('G')
    for(let x in obj) {
      this[x] = obj[x]
    }
    this._c = obj.c || 'rgba(0, 0, 0, .1)'
    this.children = []
  }
  add(...args:[any]) {
    this.children.push(...args)
  }
  remove(obj: any) {
    let i = this.children.indexOf(obj)
    this.children.splice(i, 1)
  }
  clear() {
    this.children = []
  }
  onFocus() {
    this.c = '#ff0'
  }
  onBlur() {
    this.c = this._c
  }
}

// 注册事件 G 以及绘制方法
Painter.reg('G', function(node: G): any{
  const { children, center, deg, w, h, left, top, c = 'rgba(0, 0, 0, .1)', clip, fill, stroke } = node
  if(clip && w && h) {
    this.beginPath()
    this.rect(left, top, w, h)
    this.clip()
  }
  this.beginPath()
  this.translate(...center)
  this.rotate(deg * Math.PI / 180)
  this.translate(-center[0] + left, -center[1] + top)
  this.rect(0, 0, w, h)
  if(fill) {
    this.fillStyle = c
    this.fill()
  } else if (stroke) {
    this.strokeStyle = c
    this.stroke()
  }
  const self = this
  for(let x in children) {
    Painter.draw(self, children[x].tag, children[x])
  }
  this.translate(-left, -top)
  this.rotate(-deg * Math.PI / 180)
})