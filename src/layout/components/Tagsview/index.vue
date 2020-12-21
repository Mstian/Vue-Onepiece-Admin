<template>
  <div class="tags-view">
    <el-scrollbar
      :vertical="false"
      class="scroll-container"
    >
      <div v-for="(item, index) in dynamicTagList" :key="index" :class="['scroll-item', $route.path === item.path ? 'active' : '']">
        <router-link :to="item.path">
          {{item.name}}
        </router-link>
        <span @click="deleteOneMenu(item)" v-if="index !==0 " class="el-icon-close"></span>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
import {useDynamicRoutesHook} from '@/composition/useTagViewApi.ts';
import {useRoute} from 'vue-router';
export default {
  setup() {
    const route = useRoute();
    const {deleteDynamicTag, dynamic} = useDynamicRoutesHook();

    function deleteOneMenu(item) {
      deleteDynamicTag(item, route.path);
    }
    
    return {
        dynamicTagList: dynamic.dRoutes,
        deleteOneMenu
    };
  }
};
</script>
<style lang="less">
@import '@/style/variable.less';
.tags-view {
  width: 100%;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  .scroll-item {
    border: 1px solid #eee;
    border-radius: 3px;
    padding: 2px 8px;
    display: inline-block;
    margin-right: 2px;
  }
  a {
    text-decoration: none;
    color: #666;
    padding: 0 10px;
  }
}
.el-icon-close{
    cursor: pointer;
    border-radius: 50%;
    padding: 1px;
    transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
}
.el-icon-close:hover{
  background: #b4bccc;
}
.scroll-container {
  text-align: left;
  padding: 5px 0;
  white-space: nowrap;
  position: relative;
  overflow: hidden;
  width: 100%;
  ::v-deep {
    .el-scrollbar__bar {
      bottom: 0px;
    }
    .el-scrollbar__wrap {
      height: 49px;
    }
    .el-scrollbar__wrap::-webkit-scrollbar{
      display: none;
    }
  }
}
.active{
  background: @menuActiveText;
  position: relative;
  color: #fff;
  a{
    color: #fff;
  }
}
.active::before{
    content: "";
    background: #fff;
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    position: absolute;
    top: 50%;
    left: 5px;
    margin-top: -4px;
    margin-right: 2px;
}
</style>
