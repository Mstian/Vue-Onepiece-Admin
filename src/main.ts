import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import ElementPlus from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';

import request from "@/request/index";

// 这里监听请求的错误统一处理（做弹窗提示提示）
request.on("HttpStatusSuccess", () => {
   console.log("Capture status");
});

createApp(App).use(store).use(router).use(ElementPlus).mount('#app');
