import ElementUI from "element-ui";
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
Vue.config.productionTip = false;

import "@/assets/style/font.css";
import "@/assets/style/reset.css";
import "element-ui/lib/theme-chalk/index.css";
import "./assets/style/bd.scss";

Vue.use(ElementUI, { size: "small" });

new Vue({
  el: "#app",
  router,
  render: (h) => h(App),
});
