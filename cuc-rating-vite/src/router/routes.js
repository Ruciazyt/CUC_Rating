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

export default routes;
