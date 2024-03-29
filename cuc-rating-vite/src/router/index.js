// 导入 router
import { createRouter, createWebHistory } from "vue-router";
// 导入路由各页面配置

const routes = [
  {
    path: "/",
    name: "index",
    title: "首页",
    component: () => import("@/views/TotalScore/TotalScore.vue"),
    // component: () => import("@/views/SelfReport/SelfReport.vue"),
  },
  {
    path: "/scoreIndex",
    name: "scoreIndex",
    title: "打分页面",
    component: () => import("@/views/SelfReport/SelfReport.vue"),
  },
  {
    path: "/totalScore",
    name: "totalScore",
    title: "总分",
    component: () => import("@/views/TotalScore/TotalScore.vue"),
  },
  {
    path: "/hints",
    name: "hint",
    title: "提示",
    component: () => import("@/views/HintsPage/index.vue"),
  },
];

// 配置router对象
const router = createRouter({
  history: createWebHistory(),
  routes,
});
export default router;
