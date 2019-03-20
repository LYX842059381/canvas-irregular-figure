import vNode from '../VNode'
import Painter from '../Painter'

/* 类型定义 */
interface line {
  p1: [number, number]
  p2: [number, number]
  c?: string
  w?: number
}

/* main */
export default class Line extends vNode {
  _p1: [number, number]
  _p2: [number, number]
  p1: [number, number]
  p2: [number, number]
  pm: [number, number]
  c: string = '#f00'
  w: number = 1
  deg: number = 0
  constructor(obj:line) {
    super('LINE')
    if(!obj.w) obj.w = 1
    for(let x in obj) {
      this[x] = obj[x]
    }
    this._p1 = this.p1
    this._p2 = this.p2
     this.pm = [(this.p1[0] + this.p2[0])/2, (this.p1[1] + this.p2[1])/2]
  }
  matrix(a:number = 1, b:number = 1, c:number = 0, d:number = 0, e:number = 0, f:number = 0) {
    const { _p1, _p2, pm } = this
    function calc(pointer: [number, number]): [number, number] {
      let _p = [pointer[0] - pm[0], pointer[1] - pm[1]]
      return [a * _p[0] +  c * _p[1] + e + pm[0], b * _p[0] + d * _p[1] + f + pm[1]]
    }
    this.p1 = calc(_p1)
    this.p2 = calc(_p2)
  }
  /**
   * 旋转
   * @param deg 角度
   */
  rotate(deg) {
    this.matrix(Math.cos(deg * Math.PI / 180),Math.sin(deg * Math.PI / 180),-Math.sin(deg * Math.PI / 180),Math.cos(deg * Math.PI / 180), 0, 0)
  }
  /**
   * 平移
   * @param x x { number }
   * @param y y { number }
  */
  translate(x:number, y:number) {
  this.matrix(1, 0, 0, 1, x, y)
  }
}

/* 注册绘制方法 */
Painter.reg('LINE', function(node:Line) {
  const { p1, p2, pm, c, w} = node
  this.lineWidth = w
  this.moveTo(...p1)
  this.lineTo(...p2)
  this.strokeStyle = c
  this.stroke()
})