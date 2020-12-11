<template>
  <div class="demo-image__placeholder">
    <div class="block">
      <span class="demonstration">默认</span>
      <el-image :src="src"></el-image>
    </div>
    <div class="block">
      <span class="demonstration">自定义</span>
      <el-image :src="src">
        <template #placeholder>
          <div class="image-slot">加载中<span class="dot">...</span></div>
        </template>
      </el-image>
    </div>
  </div>
</template>

<script>
export default {
  setup() {
    return {
      src:
        "https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg"
    };
  }
};
</script>
