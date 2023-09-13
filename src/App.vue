<!--<template>-->
<!--  <div class="container">-->

<!--    <router-view/>-->
<!--&lt;!&ndash;    将home.vue加载到这里&ndash;&gt;-->
<!--  </div>-->
<!--</template>-->

<template>
  <div class="container">
    <router-view v-if="isRouterAlive" />
  </div>
</template>

<script>
export default {
  name: 'App',
  provide () {
    return {
      reload: this.reload
    }
  },
  data () {
    return {
      isRouterAlive: true
    }
  },
  methods: {
    reload () {
      this.isRouterAlive = false
      this.$nextTick(function () {
        this.isRouterAlive = true
      })
    }
  }
}
</script>

<!--<style>-->

<!--</style>-->
