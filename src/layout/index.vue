<template>
  <div>
    <el-container>
      <el-aside>
        <Sidebar :routes="routes"></Sidebar>
      </el-aside>
      <el-container>
        <el-header>
          <Head></Head>
        </el-header>
        <el-main>
            <router-view v-slot="{Component}">
              <transition name="fade-transform" mode="out-in">
                <component class="view" :is="Component"></component>
              </transition>
            </router-view>
            <Drawer></Drawer>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts">
import { ref, reactive, watchEffect } from "vue";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";

import Sidebar from "./components/Sidebar/index.vue";
import Head from "./components/Header/index.vue";
import Drawer from "./components/Drawer/index.vue";

import { useDynamicRoutesHook } from "@/composition/useTagViewApi";
export default {
  setup() {
    const {dynamicRouteTags} = useDynamicRoutesHook();
    const route = useRoute();
    const store = useStore();
    const routes = store.state.controls.staticRoutes;
    // 初始化页面刷新保证当前路由tabview存在
    let stop = watchEffect(() => {
      let parentPath = route.path.slice(0, route.path.lastIndexOf("/"));
      dynamicRouteTags(route.path, parentPath);
    });
    setTimeout(() => {
      // 监听只执行一次，但获取不到当前路由，需要下一个事件轮询中取消监听
      stop();
    }, 0);
    return {
      routes
    };
  },
  components: {
    Sidebar,
    Head,
    Drawer
  }
};
</script>
<style>
section.el-container.is-vertical {
  height: 100vh;
  overflow-y: scroll;
  width: calc(100vh - 210px);
}
.el-main::-webkit-scrollbar {
	display: none;
}
.el-aside {
  width: auto !important;
  height: 100vh;
  overflow-y: scroll;
}
.el-menu {
  width: 210px !important;
  min-height: 100%;
}
.el-menu--collapse {
  width: 60px !important;
}
/*隐藏文字*/
.el-menu--collapse .el-submenu__title span {
  display: none;
}
/*隐藏 > */
.el-menu--collapse .el-submenu__title .el-submenu__icon-arrow {
  display: none;
}
</style>
<style lang="less" scoped>
// @import "@/style/transition.less";
/* fade-transform */
.fade-transform-leave-active,
.fade-transform-enter-active {
  transition: all .5s;
}

.fade-transform-enter {
  opacity: 0;
  transform: translateX(-30px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.el-header {
  padding: 0;
  height: 70px !important;
}
</style>
