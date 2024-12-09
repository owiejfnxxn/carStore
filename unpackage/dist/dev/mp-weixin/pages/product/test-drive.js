"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      productInfo: {
        id: "",
        name: "",
        image: ""
      },
      formData: {
        name: "",
        phone: "",
        date: "",
        timeSlot: "",
        remark: ""
      },
      cities: ["北京", "上海", "广州", "深圳"],
      cityIndex: -1,
      storeIndex: -1,
      storeMap: {
        "北京": ["朝阳店", "海淀店", "丰台店"],
        "上海": ["浦东店", "静安店", "徐汇店"],
        "广州": ["天河店", "越秀店", "海珠店"],
        "深圳": ["南山店", "福田店", "罗湖店"]
      },
      timeSlots: ["9:00-11:00", "11:00-13:00", "14:00-16:00", "16:00-18:00"],
      showErrors: false,
      isSubmitting: false
    };
  },
  computed: {
    currentStores() {
      return this.cityIndex >= 0 ? this.storeMap[this.cities[this.cityIndex]] : [];
    },
    startDate() {
      const date = /* @__PURE__ */ new Date();
      return date.toISOString().split("T")[0];
    },
    endDate() {
      const date = /* @__PURE__ */ new Date();
      date.setDate(date.getDate() + 30);
      return date.toISOString().split("T")[0];
    },
    isValidPhone() {
      return /^1[3-9]\d{9}$/.test(this.formData.phone);
    },
    canSubmit() {
      return this.formData.name && this.isValidPhone && this.cityIndex >= 0 && this.storeIndex >= 0 && this.formData.date && this.formData.timeSlot;
    }
  },
  onLoad(options) {
    if (options.id) {
      this.productInfo = {
        id: options.id,
        name: "2024款 春风NK400",
        image: "https://via.placeholder.com/300x200"
      };
    }
    const userInfo = common_vendor.index.getStorageSync("userInfo");
    if (userInfo) {
      this.formData.name = userInfo.realName || "";
      this.formData.phone = userInfo.phone || "";
    }
  },
  methods: {
    handleCityChange(e) {
      this.cityIndex = e.detail.value;
      this.storeIndex = -1;
    },
    handleStoreChange(e) {
      this.storeIndex = e.detail.value;
    },
    handleDateChange(e) {
      this.formData.date = e.detail.value;
      this.formData.timeSlot = "";
    },
    selectTimeSlot(slot) {
      this.formData.timeSlot = slot;
    },
    validateForm() {
      this.showErrors = true;
      if (!this.formData.name)
        return false;
      if (!this.isValidPhone)
        return false;
      if (this.cityIndex < 0)
        return false;
      if (this.storeIndex < 0)
        return false;
      if (!this.formData.date)
        return false;
      if (!this.formData.timeSlot)
        return false;
      return true;
    },
    submitForm() {
      if (!this.validateForm())
        return;
      if (this.isSubmitting)
        return;
      const isLoggedIn = common_vendor.index.getStorageSync("isLoggedIn");
      if (!isLoggedIn) {
        common_vendor.index.showModal({
          title: "提示",
          content: "预约试驾需要登录，是否前往登录？",
          success: (res) => {
            if (res.confirm) {
              common_vendor.index.navigateTo({
                url: "/pages/login/index"
              });
            }
          }
        });
        return;
      }
      this.isSubmitting = true;
      common_vendor.index.showLoading({ title: "提交中..." });
      setTimeout(() => {
        common_vendor.index.hideLoading();
        this.isSubmitting = false;
        common_vendor.index.showToast({
          title: "预约成功",
          icon: "success"
        });
        setTimeout(() => {
          common_vendor.index.navigateBack();
        }, 1500);
      }, 1500);
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.productInfo.image,
    b: common_vendor.t($data.productInfo.name),
    c: $data.showErrors && !$data.formData.name ? 1 : "",
    d: $data.formData.name,
    e: common_vendor.o(($event) => $data.formData.name = $event.detail.value),
    f: $data.showErrors && !$data.formData.name
  }, $data.showErrors && !$data.formData.name ? {} : {}, {
    g: $data.showErrors && !$options.isValidPhone ? 1 : "",
    h: $data.formData.phone,
    i: common_vendor.o(($event) => $data.formData.phone = $event.detail.value),
    j: $data.showErrors && !$data.formData.phone
  }, $data.showErrors && !$data.formData.phone ? {} : {}, {
    k: $data.showErrors && $data.formData.phone && !$options.isValidPhone
  }, $data.showErrors && $data.formData.phone && !$options.isValidPhone ? {} : {}, {
    l: common_vendor.t($data.cities[$data.cityIndex] || "请选择城市"),
    m: common_vendor.o((...args) => $options.handleCityChange && $options.handleCityChange(...args)),
    n: $data.cityIndex,
    o: $data.cities,
    p: $data.showErrors && $data.cityIndex < 0 ? 1 : "",
    q: $data.showErrors && $data.cityIndex < 0
  }, $data.showErrors && $data.cityIndex < 0 ? {} : {}, {
    r: common_vendor.t($options.currentStores[$data.storeIndex] || "请选择门店"),
    s: common_vendor.o((...args) => $options.handleStoreChange && $options.handleStoreChange(...args)),
    t: $data.storeIndex,
    v: $options.currentStores,
    w: $data.cityIndex < 0,
    x: $data.showErrors && $data.cityIndex >= 0 && $data.storeIndex < 0 ? 1 : "",
    y: $data.showErrors && $data.cityIndex >= 0 && $data.storeIndex < 0
  }, $data.showErrors && $data.cityIndex >= 0 && $data.storeIndex < 0 ? {} : {}, {
    z: common_vendor.t($data.formData.date || "请选择日期"),
    A: $options.startDate,
    B: $options.endDate,
    C: common_vendor.o((...args) => $options.handleDateChange && $options.handleDateChange(...args)),
    D: $data.showErrors && !$data.formData.date ? 1 : "",
    E: $data.showErrors && !$data.formData.date
  }, $data.showErrors && !$data.formData.date ? {} : {}, {
    F: $data.formData.date
  }, $data.formData.date ? common_vendor.e({
    G: common_vendor.f($data.timeSlots, (slot, index, i0) => {
      return {
        a: common_vendor.t(slot),
        b: index,
        c: $data.formData.timeSlot === slot ? 1 : "",
        d: common_vendor.o(($event) => $options.selectTimeSlot(slot), index)
      };
    }),
    H: $data.showErrors && !$data.formData.timeSlot
  }, $data.showErrors && !$data.formData.timeSlot ? {} : {}) : {}, {
    I: $data.formData.remark,
    J: common_vendor.o(($event) => $data.formData.remark = $event.detail.value),
    K: common_vendor.t($data.formData.remark.length),
    L: common_vendor.t($data.isSubmitting ? "提交中..." : "提交预约"),
    M: !$options.canSubmit || $data.isSubmitting,
    N: common_vendor.o((...args) => $options.submitForm && $options.submitForm(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-0e88daf9"]]);
wx.createPage(MiniProgramPage);
