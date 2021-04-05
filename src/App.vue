<template>
  <div>
    <router-view v-if="$route.path === '/login'"></router-view>
    <layout v-else></layout>
  </div>
</template>
<script>
import layout from '@/layout/index.vue';
export default {
  setup() {
    return {};
  },
  components: {
    layout
  }
};
</script>
<style lang="less">
@import '@/style/variable.less';
body{
  margin: 0;
}
#app {
  min-width: 1280px;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  .el-button--primary{
    background: @menuActiveText; // button 主题色保持一致
    border-color: @menuActiveText;
  }
}
</style>
