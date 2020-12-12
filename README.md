# plan

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).



#### 欢迎使用VUE3.0 + ElementPlus 后台管理模板

该项目基于Vuecli 使用Vue3 + 最新版ElementPlus 构建简单版后台管理系统

基本功能：（Home页面有详细介绍可参考）
通过路由自动生成侧边栏menu
打开menu可以自动生成标签页
可以使用less变量控制激活颜色
还可以通过less变量控制主题色

有需要生成menu的路由单独可以配置在一个文件，将不需要生成menu的路由配置在另外一个文件。
没有权限系统，没有登录功能等等。

简单，开箱即用。可以完全胡乱修改。可以作为Vue3项目基本参考。

最后，求个star。

### 开发过程中遇到问题以及解决方法

1. scss in typescript （sass问题较多，现已采用less）
报错：`Cannot find module ‘./index.module.scss‘ or its corresponding type declarations.ts(2307）`
解决： 需要添加类型声明文件
https://blog.csdn.net/qq_41804324/article/details/109388570
https://juejin.cn/post/6844903560056930311

2. 递归组件
组件自身调用自身 参考sideBar组件

3. pug(jade)模板
文档：https://www.pugjs.cn/api/getting-started.html

4. resolvePath
使用path模块高效的处理路径拼接

5. watch 与watchEffect区别
watch不会立即执行 watchEffect会立即执行 并且可以手动取消监听

6. 新版transition使用
参考 layout /plan/src/layout/index.vue

7. 浏览器控制台警告Source Map 
https://blog.csdn.net/sundacheng1989/article/details/51118865

8. 浏览器控制台警告 HMR API usage is out of date.
https://forum.vuejs.org/t/hmr-api-usage-is-out-of-date-mutiple-warnings/107633

9. es-lint快速修复
npm run lint -- --fix

10. vue-router4 404页面*配置 参考router->defaultRouter.ts
