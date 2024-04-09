import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);

const router = new VueRouter({
  base: "/",
  mode: "hash",
  scrollBehavior: () => ({
    y: 0,
  }),
  routes: [
    {
      path: "/",
      component: () => import("@/views/QueryBuilderDemo"),
      meta: {
        hidden: true,
      },
    },
  ],
});

export default router;
