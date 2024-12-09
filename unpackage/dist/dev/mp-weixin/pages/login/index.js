"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      form: {
        username: "",
        password: ""
      },
      showPassword: false,
      rememberPassword: false
    };
  },
  onLoad() {
    const userInfo = common_vendor.index.getStorageSync("userInfo");
    if (userInfo && this.rememberPassword) {
      this.form.username = userInfo.username;
      this.form.password = userInfo.password;
    }
  },
  methods: {
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
    handleRememberChange(e) {
      this.rememberPassword = e.detail.value;
      if (!this.rememberPassword) {
        const userInfo = common_vendor.index.getStorageSync("userInfo");
        if (userInfo) {
          userInfo.password = "";
          common_vendor.index.setStorageSync("userInfo", userInfo);
        }
      }
    },
    handleLogin() {
      if (!this.form.username || !this.form.password) {
        common_vendor.index.showToast({
          title: "请输入用户名和密码",
          icon: "none"
        });
        return;
      }
      common_vendor.index.showLoading({
        title: "登录中..."
      });
      const mockUsers = [{
        username: "admin",
        password: "123456"
      }, {
        username: "test",
        password: "123456"
      }];
      const user = mockUsers.find(
        (u) => u.username === this.form.username && u.password === this.form.password
      );
      setTimeout(() => {
        common_vendor.index.hideLoading();
        if (user) {
          const userInfo = {
            isLogin: true,
            username: user.username,
            password: this.rememberPassword ? user.password : ""
          };
          common_vendor.index.setStorageSync("userInfo", userInfo);
          common_vendor.index.setStorageSync("isLoggedIn", true);
          common_vendor.index.showToast({
            title: "登录成功",
            icon: "success"
          });
          common_vendor.index.$emit("loginSuccess", userInfo);
          setTimeout(() => {
            common_vendor.index.navigateBack();
          }, 1500);
        } else {
          common_vendor.index.showToast({
            title: "用户名或密码错误",
            icon: "none"
          });
        }
      }, 1e3);
    },
    handleForgetPassword() {
      common_vendor.index.showToast({
        title: "暂未开放，请联系客服",
        icon: "none"
      });
    },
    goToRegister() {
      common_vendor.index.navigateTo({
        url: "/pages/login/register"
      });
    },
    handleOtherLogin(type) {
      common_vendor.index.showToast({
        title: `${type}登录功能暂未开放`,
        icon: "none"
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.form.username,
    b: common_vendor.o(($event) => $data.form.username = $event.detail.value),
    c: $data.showPassword ? "text" : "password",
    d: $data.form.password,
    e: common_vendor.o(($event) => $data.form.password = $event.detail.value),
    f: common_vendor.n($data.showPassword ? "icon-eye-open" : "icon-eye-close"),
    g: common_vendor.o((...args) => $options.togglePassword && $options.togglePassword(...args)),
    h: $data.rememberPassword,
    i: common_vendor.o((...args) => $options.handleRememberChange && $options.handleRememberChange(...args)),
    j: common_vendor.o((...args) => $options.handleForgetPassword && $options.handleForgetPassword(...args)),
    k: common_vendor.o((...args) => $options.handleLogin && $options.handleLogin(...args)),
    l: common_vendor.o((...args) => $options.goToRegister && $options.goToRegister(...args)),
    m: common_vendor.o(($event) => $options.handleOtherLogin("wechat")),
    n: common_vendor.o(($event) => $options.handleOtherLogin("alipay"))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-d08ef7d4"]]);
wx.createPage(MiniProgramPage);
