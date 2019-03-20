import vNode from '../VNode'
import Painter from '../Painter'

/* 多边形 */
interface polygon {
  pointers: Array<[number, number]>
  c?: string
  fill?: boolean
  center?: [number, number],
  fillStyle?: string,
  sort?: boolean
}
export default class Polygon extends vNode {
  pointers!: Array<[number, number]>
  c?: string
  fill!: boolean
  w!: number
  fillStyle!: string
  center!: [number, number]
  sort: boolean = true
  constructor(obj: polygon) {
    super('POLYGON')
    this.calcCenter(obj.pointers)
    for(let x in obj) {
      this[x] = obj[x]
    }    
    if(this.sort){
      this.pointers = obj.pointers.sort((a:[number, number], b: [number, number]) => {
        return (a[0] - this.center[0]) * (b[1] - this.center[1]) - (a[1] - this.center[1]) * (b[0] - this.center[0])
      })
    }
  }
  calcCenter(pointers: Array<[number, number]>) {
    let pE = [0, 0]
    for(let x in pointers) {
      pE[0] += pointers[x][0]
      pE[1] += pointers[x][1]
    }
    this.center = [pE[0]/pointers.length, pE[1]/pointers.length]
  }
  shake() {
    this.pointers = this.pointers.map(item => {
      item[0] += Math.random() * 4 - 2
      return item
    })
  }
}

Painter.reg('POLYGON', function(node: Polygon) {
  const { pointers, c = '#ff0', w = 1, fill, fillStyle = 'rgb(211, 211, 211, .3)' } = node
  for(let x in pointers) {
    this.lineTo(...pointers[x])
  }
  this.lineWidth  = w
  this.closePath()
  this.strokeStyle = c
  this.stroke()
  if(fill) {
    this.fillStyle = fillStyle
    this.fill()
  }  
})
