import { staticRoutes } from '../../router/staticRoutes';
export default {
  state: {
    isCollapse: false, // 控制菜单展开与折叠
    staticRoutes: staticRoutes
  },
  mutations: {
    TOOGLESIDEBAR (state: any) {
      state.isCollapse = !(state.isCollapse);
    }
  },
  actions: {
  },
  getters: {
  },
  modules: {
  }
};
