<template>
  <div>
    <basic_narbar></basic_narbar>
    <div class="columns">
      <div class="column is-one-fifth"></div>
      <div class="column is-three-fifths">
        <div class="notification" style="font-size:18px">
          视频<strong>LR.mp4</strong>正在上传处理 , 可以通过刷新页面查看右上头像左边的链接查看是否处理完成。
        </div>
        <button class="button" style="float:right">
          <a href="/videoprocess">
            继续处理视频
          </a>
        </button>
      </div>
      <div class="column is-one-fifth"> </div>
    </div>
  </div>
</template>

<script>
export default {
name: "Fake"
}
</script>

<style scoped>

</style>