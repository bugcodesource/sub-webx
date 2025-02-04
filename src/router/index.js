import Vue from "vue";
import VueRouter from "vue-router";
import Subconverter from "../views/Subconverter.vue";
import Setting from "../views/Setting.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "SubConverter",
    component: Subconverter
  },
  {
    path: "/setting",
    name: "Setting",
    component: Setting
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
