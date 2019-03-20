<template lang="pug">
  #world.world
</template>
<script>
const  { Map, PolyCoordinate } = require('@/utils/dCanvas/index').default

export default {
  name: 'world',
  props: ['info'],
  methods: {
    init() {
      const { info = {} } = this
      const m = new Map('world')
      const p1 = new PolyCoordinate(info)
      m.add(p1)
      m.render()
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.init()
    })
  }
}
</script>

<style lang="less" scoped>
  .world {
    height: 100%;
  }
</style>
