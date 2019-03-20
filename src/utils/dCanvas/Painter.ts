/**
 * 绘制者
 * 包含 绘制和注册绘制方法事件
 */
let Painter: any = {
  c: CanvasRenderingContext2D,
  /**
   * 
   * @param c context2D
   * @param type 已注册类型
   * @param obj 数据对象
   */
  draw(c: CanvasRenderingContext2D, type:string, obj : any) {
    this.c = c
    return (() => {
      c.save()
      c.beginPath()
      this[type].call(c, obj)
      c.restore()
    })()
  },
  /**
   * 注册
   * @param method 需要注册的方法
   * @param fn 绘制方法
   */
  reg(method:string, fn:void) {
    this[method] = fn
  }
}

export default Painter