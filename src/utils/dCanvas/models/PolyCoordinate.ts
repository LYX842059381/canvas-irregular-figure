import vNode from '../VNode'
import Painter from '../Painter'
import Lines from './Lines'
import Line from './Line'
import G from './G';
import Polygon from './Polygon'

let tag = 'POLY_COORDINATE'

interface poly {
  w?: number
  h?: number
  data?: Array<number>
  axis?: Array<string>
}

/**
 * 多边形坐标系
 *
 * @export
 * @class PolyCoordinate
 * @extends {vNode}
 * @constructor
 * @param { poly } obj
 */

export default class PolyCoordinate extends vNode {
  w: number = 400
  h: number = 400
  data: Array<number>
  axis: Array<string>
  constructor(obj: poly) {
    super(tag)
    for(let x in obj) {
      this[x] = obj[x]
    }    
  }
  get center() {
    const { w, h } = this
    return [ w/2, h/2 ]
  }
}

Painter.reg(tag, function(node: PolyCoordinate) {
  const { data, w, h, center, axis = [] } = node
  const _self = this
  let r = center[0] * .8
  let g = new G()
  let l = axis.length
  if(l <= 2) return console.warn('数据长度必须大于等于3')
  let perDeg = 360 / l

  for(let i = 0 ; i < 5; i ++ ) {
    let p_1 = new Polygon({
      pointers: Array.apply(null, {length: l}).map((Item, index) => {
        let deg = index * perDeg - 90
        let _r = (5 - i) * r / 5
        let _x = Math.cos( deg * Math.PI / 180 ) * _r + center[0]
        let _y = Math.sin( deg * Math.PI / 180) * _r + center[1]
        return [_x, _y]
      }),
      c: '#333',
      fill: true,
      fillStyle: i % 2 ? 'rgba(255, 255, 255, 1)' : 'rgba(200, 200, 200, 1)'
    })
    g.add(p_1)
  }
  for(let i = 0 ; i < l; i ++ ) {
    let deg = i * perDeg - 90
    let l_1 = new Line({
      p1: center as [number, number],
      p2: [Math.cos( deg * Math.PI / 180 ) * r + center[0], Math.sin( deg * Math.PI / 180) * r + center[1]],
      c: '#333',
      w: .5
    })
    g.add(l_1)
  }

  let p_2 = new Polygon({
    pointers: Array.apply(null, {length: l}).map((Item, index) => {
      let deg = index * perDeg - 90
      let _x = Math.cos( deg * Math.PI / 180 ) * (data[index] || 0) / 100 * r + center[0]
      let _y = Math.sin( deg * Math.PI / 180) * (data[index] || 0) / 100 * r + center[1]
      return [_x, _y]
    }),
    c: '#f00',
    fill: true,
    fillStyle: 'rgba(255, 0, 0, .4)'
  })  
  
  g.add(p_2)
  g.center = center as [number, number]
  Painter.draw(_self, 'G', g)  
})