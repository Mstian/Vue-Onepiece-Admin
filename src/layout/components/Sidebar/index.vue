<template lang="pug">
el-menu(
  class="el-menu-vertical-demo"
  :collapse="state.controls.isCollapse"
  :collapse-transition="false"
  router
  :default-active="$route.path"
  :background-color="variables.menuBg"
  @select="menuSelect"
  :text-color="variables.menuText"
  :active-text-color="variables.menuActiveText"
)
  Sidebar(:item="routes" basePath="")
</template>

<script lang="ts">
import { useStore } from 'vuex';
import {
    useRouter, useRoute
} from "vue-router";
import {ref, onMounted} from 'vue';
import Sidebar from './Sidebar.vue';

import {useDynamicRoutesHook} from '@/composition/useTagViewApi';
import variables from '@/style/variable.less';
export default {
  props: ['routes'],
  setup () {
    const store = useStore();
    const route = useRoute();
    const useRoutesHook = useDynamicRoutesHook();

    function menuSelect(index: any) {
      let parentPath = '';
      let parentPathIndex = index.lastIndexOf('/');
      if( parentPathIndex > 0) {
        parentPath = index.slice(0, parentPathIndex);
      }
      useRoutesHook.dynamicRouteTags(index, parentPath);
    }
    return {
      state: store.state,
      menuSelect,
      variables
    };
  },
  components: {
    Sidebar
  }
};
</script>
<style lang="less" scoped>
</style>