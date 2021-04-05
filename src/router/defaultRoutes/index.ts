import Inner from "@/views/Inner.vue";
import NotFound from '@/views/NotFound.vue';
import Login from "@/views/Login.vue";
const defaultRoutes: any = [
  {
    path: "/inner",
    name: "内部页面",
    component: Inner,
    meta: {
      activePath: '/'  // 打开非Menu页面选择当前激活menu
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: '404',
    component: NotFound
  },
  {
    path: '/login',
    name: '登录',
    component: Login
  }
];

export default defaultRoutes;
