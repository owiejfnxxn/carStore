"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
if (!Math) {
  "./pages/index/index.js";
  "./pages/forum/index.js";
  "./pages/spots/index.js";
  "./pages/user/index.js";
  "./pages/product/detail.js";
  "./pages/product/list.js";
  "./pages/login/index.js";
  "./pages/login/register.js";
  "./pages/forum/detail.js";
  "./pages/forum/create.js";
  "./pages/product/test-drive.js";
  "./pages/product/order.js";
  "./pages/user/profile.js";
  "./pages/user/order.js";
  "./pages/user/order-detail.js";
  "./pages/user/test-drive-list.js";
  "./pages/user/test-drive-detail.js";
  "./pages/user/repair.js";
  "./pages/user/repair-add.js";
  "./pages/user/repair-detail.js";
  "./pages/user/points.js";
  "./pages/user/about.js";
}
const _sfc_main = {
  onLaunch: function() {
    console.log("App Launch");
  },
  onShow: function() {
    console.log("App Show");
  },
  onHide: function() {
    console.log("App Hide");
  }
};
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
