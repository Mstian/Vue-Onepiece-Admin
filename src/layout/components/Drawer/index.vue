<template>
    <div>
        <div class="fixd" :style="{background: themeApi.theme.customTheme}" @click="openDrawer()"><i class="el-icon-setting"></i></div>
        <el-drawer
          v-model="drawer"
          size="20%"
          :with-header="false">
          <div class="title">系统设置!</div>
            <div class="content">
              <div class="themeColor">
              <span class="theme-title">主题色：</span>
              <!-- colorPicker组件目前有问题 -->
              <!-- <el-color-picker v-model="themeApi.theme.customTheme" size="small"></el-color-picker> --> 
              <div>
                <span 
                  v-for="(item, index) in themeType.themeArr" 
                  :key="index" :style="{background:item}" 
                  class="theme-type"
                  @click="themeApi.setTheme(item)" >
                </span>
              </div>
              
            </div> 
            <div class="logout">
               <el-button size="mini" type="danger" @click="logout()">退出登录</el-button>
            </div>
          </div>
        </el-drawer>
    </div>
</template>
<script>
import {ref, reactive} from "vue";
import { useRouter } from "vue-router";
import {useTheme} from '@/composition/useThemeApi';
export default {
    setup() {
      let drawer = ref(false);
      const router = useRouter();
      const themeApi = useTheme();
      const themeType = reactive({
        themeArr: ['#FFFFFF', '#999EFF', '#1890ff', '#304156','#212121','#11a983', '#13c2c2', '#6959CD', '#f5222d']
      });
      function openDrawer() {
        drawer.value = !drawer.value;
      }
      function activeChange() {
        console.log(123);
      }

      const logout = () => {
        localStorage.removeItem('user');
        router.push('/login');
      };
      return {
        drawer,
        openDrawer,
        themeApi,
        activeChange,
        themeType,
        logout
      };
    }
};
</script>
<style lang="less" scoped>
.fixd{
  border: 1px solid #ddd;
  position: fixed;
  right: 0;
  top: 30%;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  background:red;
  opacity: .6;
  cursor: pointer;
  .el-icon-setting{
    font-size: 24px;
    color: #aaa;
  }
}
.title{
  font-size: 16px;
  padding: 20px;
  text-align: center;
}
.content{
  padding: 10px;
  >div{
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
}
.theme-title{
  font-size:16px;
}
.theme-type{
  width: 14px;
  height: 14px;
  display: inline-block;
  cursor: pointer;
  margin-right: 5px;
  border: 1px solid #eee;
}
</style>