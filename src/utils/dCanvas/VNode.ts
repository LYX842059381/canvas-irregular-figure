/**
 * 对象父类型 vNode
 * 所有类型继承自 vNode
 */
export default class vNode {
  tag: string
  id: string = 'node_' + Math.floor(Math.random() * 1000) + new Date().getTime()
  name: string = ''
  parent: any
  constructor(tag: string) {
    this.tag = tag
  }
}