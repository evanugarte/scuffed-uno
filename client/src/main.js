import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./registerServiceWorker";
import SimpleAnalytics from "simple-analytics-vue";
// import Ads from "vue-google-adsense";

Vue.config.productionTip = false;

Vue.use(SimpleAnalytics, {
  skip: process.env.NODE_ENV !== "production",
  domain: "api.scuffeduno.online",
});

// Vue.use(require("vue-script2"));
// Vue.use(Ads.Adsense);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
