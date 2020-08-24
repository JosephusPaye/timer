import Vue from "vue";
import App from "./App.vue";
import * as emojicon from "emojicon";

Vue.config.productionTip = false;

emojicon.set("⏳");

new Vue({
  render: h => h(App)
}).$mount("#app");
