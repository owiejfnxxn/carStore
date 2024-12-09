"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      userInfo: {
        avatar: "https://via.placeholder.com/80x80",
        username: "",
        realName: "",
        idCard: "",
        phone: ""
      },
      showErrors: false
    };
  },
  computed: {
    isValidPhone() {
      return /^1[3-9]\d{9}$/.test(this.userInfo.phone);
    },
    isValidIdCard() {
      return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(this.userInfo.idCard);
    }
  },
  onLoad() {
    const savedInfo = common_vendor.index.getStorageSync("userInfo");
    if (savedInfo) {
      this.userInfo = {
        ...this.userInfo,
        ...savedInfo
      };
    }
  },
  methods: {
    changeAvatar() {
      common_vendor.index.chooseImage({
        count: 1,
        sizeType: ["compressed"],
        sourceType: ["album", "camera"],
        success: (res) => {
          this.userInfo.avatar = res.tempFilePaths[0];
        }
      });
    },
    validateForm() {
      this.showErrors = true;
      if (!this.userInfo.username)
        return false;
      if (!this.userInfo.realName)
        return false;
      if (!this.isValidIdCard)
        return false;
      if (!this.isValidPhone)
        return false;
      return true;
    },
    saveProfile() {
      if (!this.validateForm())
        return;
      common_vendor.index.showLoading({ title: "保存中..." });
      common_vendor.index.setStorageSync("userInfo", this.userInfo);
      setTimeout(() => {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "保存成功",
          icon: "success"
        });
        common_vendor.index.$emit("updateUserInfo", this.userInfo);
        setTimeout(() => {
          common_vendor.index.navigateBack();
        }, 1500);
      }, 1e3);
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.userInfo.avatar,
    b: common_vendor.o((...args) => $options.changeAvatar && $options.changeAvatar(...args)),
    c: $data.showErrors && !$data.userInfo.username ? 1 : "",
    d: $data.userInfo.username,
    e: common_vendor.o(($event) => $data.userInfo.username = $event.detail.value),
    f: $data.showErrors && !$data.userInfo.username
  }, $data.showErrors && !$data.userInfo.username ? {} : {}, {
    g: $data.showErrors && !$data.userInfo.realName ? 1 : "",
    h: $data.userInfo.realName,
    i: common_vendor.o(($event) => $data.userInfo.realName = $event.detail.value),
    j: $data.showErrors && !$data.userInfo.realName
  }, $data.showErrors && !$data.userInfo.realName ? {} : {}, {
    k: $data.showErrors && !$options.isValidIdCard ? 1 : "",
    l: $data.userInfo.idCard,
    m: common_vendor.o(($event) => $data.userInfo.idCard = $event.detail.value),
    n: $data.showErrors && !$data.userInfo.idCard
  }, $data.showErrors && !$data.userInfo.idCard ? {} : {}, {
    o: $data.showErrors && $data.userInfo.idCard && !$options.isValidIdCard
  }, $data.showErrors && $data.userInfo.idCard && !$options.isValidIdCard ? {} : {}, {
    p: $data.showErrors && !$options.isValidPhone ? 1 : "",
    q: $data.userInfo.phone,
    r: common_vendor.o(($event) => $data.userInfo.phone = $event.detail.value),
    s: $data.showErrors && !$data.userInfo.phone
  }, $data.showErrors && !$data.userInfo.phone ? {} : {}, {
    t: $data.showErrors && $data.userInfo.phone && !$options.isValidPhone
  }, $data.showErrors && $data.userInfo.phone && !$options.isValidPhone ? {} : {}, {
    v: common_vendor.o((...args) => $options.saveProfile && $options.saveProfile(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-036958a5"]]);
wx.createPage(MiniProgramPage);
