<template>
  <div class="home">
    <h2>欢迎使用VUE3.0 + ElementPlus 后台管理模板</h2>
    <div>1. 环境变量：{{ envName.title }}</div>
    <div>2. {{ "当前主题色值：" + themeApi.theme.customTheme }}</div>
    <div>
      <div>
        3. <el-button @click="themeApi.setTheme('red')">切换theme</el-button>
        <p>theme切换采用 将less变量存储在响应式变量中，动态切换该变量达到切换theme（右侧抽屉中可体验）核心逻辑在compisition/useThemeApi</p>
      </div>
      <div>
        4. <el-button @click="jumpToInner()">跳转内部页面</el-button>
        <p>跳转页面是非menu页面</p>
      </div>
    </div>
    <div>5. 自动menu生成：根据路由生成menu 在router->staticRoutes文件中按照路由规则配置，该menu采用递归组件，可以放心嵌套children自动生成submenu</div>
    <div>6. 非参与menu路由生成：在router->defaultRoutes文件中配置，包括404路由等</div>
    <div>7. 头部标签根据menu自动生成核心逻辑在compisition/useTagViewApi</div>
    <div>8. 当前激活菜单和头部标签激活项颜色在less变量中可设置 style/variable.less/@menuActiveText</div>
    <img alt="Vue logo" src="../assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App" />
    <h3>没有权限复杂的逻辑只有简单的布局，业务代码可以直接在自定义组件中开发</h3>
  </div>
</template>

<script lang="ts">
import { ref, reactive, provide } from "vue";
import variable from "@/style/variable.less";
import HelloWorld from "@/components/HelloWorld.vue"; // @ is an alias to /src
import { useRouter } from "vue-router";
import { useTheme } from "@/composition/useThemeApi";
export default {
  setup() {
    const themeApi = useTheme();
    const router = useRouter();
    let variables = reactive(variable);
    const envName = reactive({ title: process.env.VUE_APP_TITLE });
    function jumpToInner() {
      router.push({
        path: "/inner"
      });
    }

    provide("obj", envName); // 向子孙组件传递参数

    return {
      envName,
      variables,
      themeApi,
      jumpToInner
    };
  },
  components: {
    HelloWorld
  }
};
</script>
<style lang="less">
.home {
  // text-align: center;
  line-height: 24px;
}
.height {
  height: 999px;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
