"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      form: {
        phone: "",
        code: "",
        password: "",
        confirmPassword: ""
      },
      showPassword: false,
      showConfirmPwd: false,
      isAgreed: false,
      counting: false,
      countdown: 60
    };
  },
  methods: {
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
    toggleConfirmPwd() {
      this.showConfirmPwd = !this.showConfirmPwd;
    },
    handleAgreementChange(e) {
      this.isAgreed = e.detail.value.length > 0;
    },
    startCountdown() {
      this.counting = true;
      this.countdown = 60;
      const timer = setInterval(() => {
        if (this.countdown > 0) {
          this.countdown--;
        } else {
          this.counting = false;
          clearInterval(timer);
        }
      }, 1e3);
    },
    sendCode() {
      if (!/^1[3-9]\d{9}$/.test(this.form.phone)) {
        common_vendor.index.showToast({
          title: "请输入正确的手机号",
          icon: "none"
        });
        return;
      }
      common_vendor.index.showToast({
        title: "验证码已发送",
        icon: "success"
      });
      this.startCountdown();
    },
    handleRegister() {
      if (!this.isAgreed)
        return;
      if (!/^1[3-9]\d{9}$/.test(this.form.phone)) {
        common_vendor.index.showToast({
          title: "请输入正确的手机号",
          icon: "none"
        });
        return;
      }
      if (!this.form.code) {
        common_vendor.index.showToast({
          title: "请输入验证码",
          icon: "none"
        });
        return;
      }
      if (this.form.password.length < 6) {
        common_vendor.index.showToast({
          title: "密码不能少于6位",
          icon: "none"
        });
        return;
      }
      if (this.form.password !== this.form.confirmPassword) {
        common_vendor.index.showToast({
          title: "两次密码输入不一致",
          icon: "none"
        });
        return;
      }
      common_vendor.index.showLoading({
        title: "注册中..."
      });
      setTimeout(() => {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "注册成功",
          icon: "success"
        });
        setTimeout(() => {
          common_vendor.index.navigateBack();
        }, 1500);
      }, 1500);
    },
    showAgreement() {
      common_vendor.index.showToast({
        title: "用户协议",
        icon: "none"
      });
    },
    showPrivacy() {
      common_vendor.index.showToast({
        title: "隐私政策",
        icon: "none"
      });
    },
    goToLogin() {
      common_vendor.index.navigateBack();
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.form.phone,
    b: common_vendor.o(($event) => $data.form.phone = $event.detail.value),
    c: $data.form.code,
    d: common_vendor.o(($event) => $data.form.code = $event.detail.value),
    e: common_vendor.t($data.counting ? `${$data.countdown}s后重试` : "获取验证码"),
    f: $data.counting,
    g: common_vendor.o((...args) => $options.sendCode && $options.sendCode(...args)),
    h: $data.showPassword ? "text" : "password",
    i: $data.form.password,
    j: common_vendor.o(($event) => $data.form.password = $event.detail.value),
    k: common_vendor.n($data.showPassword ? "icon-eye-open" : "icon-eye-close"),
    l: common_vendor.o((...args) => $options.togglePassword && $options.togglePassword(...args)),
    m: $data.showConfirmPwd ? "text" : "password",
    n: $data.form.confirmPassword,
    o: common_vendor.o(($event) => $data.form.confirmPassword = $event.detail.value),
    p: common_vendor.n($data.showConfirmPwd ? "icon-eye-open" : "icon-eye-close"),
    q: common_vendor.o((...args) => $options.toggleConfirmPwd && $options.toggleConfirmPwd(...args)),
    r: common_vendor.o((...args) => $options.showAgreement && $options.showAgreement(...args)),
    s: common_vendor.o((...args) => $options.showPrivacy && $options.showPrivacy(...args)),
    t: common_vendor.o((...args) => $options.handleAgreementChange && $options.handleAgreementChange(...args)),
    v: !$data.isAgreed ? 1 : "",
    w: !$data.isAgreed,
    x: common_vendor.o((...args) => $options.handleRegister && $options.handleRegister(...args)),
    y: common_vendor.o((...args) => $options.goToLogin && $options.goToLogin(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-838b72c9"]]);
wx.createPage(MiniProgramPage);
