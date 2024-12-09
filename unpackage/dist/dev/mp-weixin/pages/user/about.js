"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      companyDesc: "你很机车是一家专注于摩托车销售和服务的综合性平台，致力于为用户提供高品质的摩托车产品和专业的售后服务。我们拥有完善的销售网络和专业的技术团队，为广大摩托车爱好者提供优质的购车体验和贴心的售��保障。",
      contact: {
        phone: "400-123-4567",
        hours: "周一至周日 9:00-18:00",
        address: "上海市浦东新区xx路xx号",
        email: "service@example.com"
      }
    };
  },
  methods: {
    makeCall(phone) {
      common_vendor.index.makePhoneCall({
        phoneNumber: phone,
        fail() {
          common_vendor.index.showToast({
            title: "拨打失败",
            icon: "none"
          });
        }
      });
    },
    checkUpdate() {
      common_vendor.index.showLoading({ title: "检查中..." });
      setTimeout(() => {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "已是最新版本",
          icon: "success"
        });
      }, 1e3);
    },
    showAgreement() {
      common_vendor.index.navigateTo({
        url: "/pages/common/agreement"
      });
    },
    showPrivacy() {
      common_vendor.index.navigateTo({
        url: "/pages/common/privacy"
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_assets._imports_0$3,
    b: common_vendor.t($data.companyDesc),
    c: common_vendor.t($data.contact.phone),
    d: common_vendor.o(($event) => $options.makeCall($data.contact.phone)),
    e: common_vendor.t($data.contact.hours),
    f: common_vendor.t($data.contact.address),
    g: common_vendor.t($data.contact.email),
    h: common_vendor.o((...args) => $options.checkUpdate && $options.checkUpdate(...args)),
    i: common_vendor.o((...args) => $options.showAgreement && $options.showAgreement(...args)),
    j: common_vendor.o((...args) => $options.showPrivacy && $options.showPrivacy(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-76431d09"]]);
wx.createPage(MiniProgramPage);
