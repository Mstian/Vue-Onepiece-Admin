<template>
  <div>
    <template v-for="(routeItem, routeIndex) in item">
      <el-menu-item
        :key="routeIndex"
        v-if="routeItem.children.length <= 0"
        :index="resolvePath(routeItem.path)"
      >
        <i :class="routeItem.meta.icon || ''"></i>
        <template #title>{{ routeItem.name }}</template>
      </el-menu-item>
      <el-submenu
        class="submenu-title"
        :key="routeIndex"
        v-if="routeItem.children.length > 0"
        :index="routeItem.path"
      >
        <template #title>
        <i :class="routeItem.meta.icon || ''"></i>
          <span>{{ routeItem.name }}</span>
        </template>
        <el-menu-item-group>
          <sidebar
            :item="routeItem.children"
            :basePath="basePath.length > 0 ? basePath + '/' + routeItem.path : routeItem.path"
          ></sidebar>
        </el-menu-item-group>
      </el-submenu>
    </template>
  </div>
</template>
<script>
import path from "path";
import { useStore } from "vuex";
import variables from '@/style/variable.less';
export default {
  name: "sidebar",
  props: {
    item: Object,
    basePath: String
  },
  setup(props, context) {
    function resolvePath(routePath) {
      let hasBasePath = props.basePath ? props.basePath : "";
      return path.resolve(hasBasePath, routePath);
    }
    return {
      resolvePath: resolvePath,
      variables
    };
  }
};
</script>
<style lang="less">
@import "@/style/variable.less";
#app {
  .el-menu-item{
    display: flex;
    align-items: center;
  }
  .is-active > .el-submenu__title {
    color: @subMenuActiveText !important;
  }
  .submenu-title-noDropdown,
  .el-submenu__title,
  .el-menu-item {
    font-weight: bold;
    &:hover {
      background-color: @menuHover !important;
    }
  }
  .el-submenu__title i{
    height: 18px;
    color: @menuText !important;
  }
  .el-menu-item i{
    height: 18px;
    color: @menuText !important;
  }
  .el-menu-item.is-active i{
    color: @menuActiveText !important;
  }
  .is-active > .el-submenu__title {
    color: @subMenuActiveText !important;
  }

  & .nest-menu .el-submenu > .el-submenu__title,
  & .el-submenu .el-menu-item {
    min-width: @sideBarWidth !important;
    background-color: @subMenuBg !important;
    &:hover {
      background-color: @subMenuHover !important;
    }
  }
}
</style>
