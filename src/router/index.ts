import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import { staticRoutes } from './staticRoutes';
import defaultRoutes from './defaultRoutes';

const routes: any = staticRoutes.concat(defaultRoutes);

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  let userInfo = localStorage.getItem('user');
  if (to.path === "/login") {
    next();
  } else {
    if (userInfo) {
      next();
    } else {
      next({
        path: '/login'
      });
    }
  }
});
export default router;
