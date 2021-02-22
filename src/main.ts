import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import ElementPlus from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';
import locale from 'element-plus/lib/locale/lang/zh-cn';
import request from "@/request/index";

// 这里监听请求的错误统一处理（做弹窗提示提示）
request.on("HttpStatusFaild", () => {
   // console.log("Capture status");
   alert("请求失败，请检查接口问题");
});

createApp(App).use(store).use(router).use(ElementPlus, {locale}).mount('#app');
