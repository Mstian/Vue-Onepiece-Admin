import { reactive } from "vue";
import { staticRoutes } from "@/router/staticRoutes";
import {useRouter} from 'vue-router';

let dynamic = reactive({
  dRoutes: [{ path: "/", name: "首页" }]
});

export function useDynamicRoutesHook() {
  const router = useRouter();
  /**
   * @param value String 当前menu对应的路由path
   * @param parentPath string 当前路由中父级路由
   */
  function dynamicRouteTags(value: any, parentPath: any) {
    const hasValue = dynamic.dRoutes.some((item, index) => {
      return item.path === value;
    });
    function concatPath(arr: any, value: any, parentPath: any){
      if (!hasValue) {
        arr.forEach((constItem: any, constIndex: any) => {
          let pathConcat = parentPath + '/' + constItem.path;
          if (constItem.path === value || pathConcat === value) {
            dynamic.dRoutes.push({ path: value, name: constItem.name });
          } else {
            if (constItem.children.length > 0) {
              concatPath(constItem.children, value, parentPath);
            }
          }
        });
      }
    }
    concatPath(staticRoutes, value, parentPath);
  }
  /**
   * @param value String 当前删除tag路由
   * @param current Objct 当前激活路由对象
   */
  function deleteDynamicTag(value: any, current: any) {
    new Promise((resolve, reject) => {
      let valueIndex = dynamic.dRoutes.findIndex((item, index) => {
        return item.path === value.path;
      });
      dynamic.dRoutes.splice(valueIndex, 1);
      resolve();
    }).then(() => {
      if (current === value.path) { // 如果删除当前激活tag就自动切换到最后一个tag
        let newRoute = dynamic.dRoutes.slice(-1);
        router.push({
          path: newRoute[0].path
        });
      }
    });
  }
  return {
    dynamic, // 动态路由
    dynamicRouteTags, // tagviews动态生成
    deleteDynamicTag // 删除tagview
  };
}
