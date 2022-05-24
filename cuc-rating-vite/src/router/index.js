// 导入 router
import { createRouter, createWebHistory } from 'vue-router'
// 导入路由各页面配置

const routes = [
    {
      path: "/",
      name: "index",
      title: "首页",
      component: () => import("@/views/SelfReport/SelfReport.vue"),
    },
    {
      path: "/totalScore",
      name: "totalScore",
      title: "总分",
      component: () => import("@/views/TotalScore/TotalScore.vue"),
    },
  ];
  
// 配置router对象
const router = createRouter({
    history: createWebHistory(),
    routes
})
export default router
