<template lang="pug">
  #app
    world(:info="info")
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import World from '@/components/World/index.vue';

@Component({
  components: {
    World,
  },
})

export default class App extends Vue {
  info = {
    data: [90, 60, 80, 60, 70],
    axis: ['1', '2', '3', '', '']
  }
}

</script>

<style>
#app {
  height: 100%;
}
</style>
