"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      types: [
        { label: "维修", value: "repair", icon: "icon-repair" },
        { label: "保养", value: "maintenance", icon: "icon-maintenance" }
      ],
      formData: {
        type: "repair",
        date: "",
        timeSlot: "",
        description: "",
        phone: ""
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
    }
  },
  methods: {
    selectType(type) {
      this.formData.type = type;
    },
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
      if (this.cityIndex < 0)
        return false;
      if (this.storeIndex < 0)
        return false;
      if (!this.formData.date)
        return false;
      if (!this.formData.timeSlot)
        return false;
      if (!this.formData.description)
        return false;
      if (!this.isValidPhone)
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
          content: "预约维修保养需要登录，是否前往登录？",
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
      const appointmentData = {
        id: Date.now(),
        type: this.formData.type,
        status: "pending",
        storeName: this.currentStores[this.storeIndex],
        appointTime: `${this.formData.date} ${this.formData.timeSlot}`,
        description: this.formData.description,
        phone: this.formData.phone,
        createTime: (/* @__PURE__ */ new Date()).toLocaleString()
      };
      setTimeout(() => {
        common_vendor.index.hideLoading();
        this.isSubmitting = false;
        try {
          const records = common_vendor.index.getStorageSync("repairRecords") || [];
          records.unshift(appointmentData);
          common_vendor.index.setStorageSync("repairRecords", records);
          common_vendor.index.$emit("updateRepairRecords", appointmentData);
        } catch (e) {
          console.error("保存记录失败:", e);
        }
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
    a: common_vendor.f($data.types, (type, index, i0) => {
      return {
        a: common_vendor.n(type.icon),
        b: common_vendor.t(type.label),
        c: index,
        d: $data.formData.type === type.value ? 1 : "",
        e: common_vendor.o(($event) => $options.selectType(type.value), index)
      };
    }),
    b: common_vendor.t($data.cities[$data.cityIndex] || "请选择城市"),
    c: common_vendor.o((...args) => $options.handleCityChange && $options.handleCityChange(...args)),
    d: $data.cityIndex,
    e: $data.cities,
    f: $data.showErrors && $data.cityIndex < 0 ? 1 : "",
    g: $data.showErrors && $data.cityIndex < 0
  }, $data.showErrors && $data.cityIndex < 0 ? {} : {}, {
    h: common_vendor.t($options.currentStores[$data.storeIndex] || "请选择门店"),
    i: common_vendor.o((...args) => $options.handleStoreChange && $options.handleStoreChange(...args)),
    j: $data.storeIndex,
    k: $options.currentStores,
    l: $data.cityIndex < 0,
    m: $data.showErrors && $data.cityIndex >= 0 && $data.storeIndex < 0 ? 1 : "",
    n: $data.showErrors && $data.cityIndex >= 0 && $data.storeIndex < 0
  }, $data.showErrors && $data.cityIndex >= 0 && $data.storeIndex < 0 ? {} : {}, {
    o: common_vendor.t($data.formData.date || "请选择日期"),
    p: $options.startDate,
    q: $options.endDate,
    r: common_vendor.o((...args) => $options.handleDateChange && $options.handleDateChange(...args)),
    s: $data.showErrors && !$data.formData.date ? 1 : "",
    t: $data.showErrors && !$data.formData.date
  }, $data.showErrors && !$data.formData.date ? {} : {}, {
    v: $data.formData.date
  }, $data.formData.date ? common_vendor.e({
    w: common_vendor.f($data.timeSlots, (slot, index, i0) => {
      return {
        a: common_vendor.t(slot),
        b: index,
        c: $data.formData.timeSlot === slot ? 1 : "",
        d: common_vendor.o(($event) => $options.selectTimeSlot(slot), index)
      };
    }),
    x: $data.showErrors && !$data.formData.timeSlot
  }, $data.showErrors && !$data.formData.timeSlot ? {} : {}) : {}, {
    y: common_vendor.t($data.formData.type === "repair" ? "问题描述" : "保养项目"),
    z: $data.formData.type === "repair" ? "请描述您遇到的问题" : "请描述需要保养的项目",
    A: $data.showErrors && !$data.formData.description ? 1 : "",
    B: $data.formData.description,
    C: common_vendor.o(($event) => $data.formData.description = $event.detail.value),
    D: common_vendor.t($data.formData.description.length),
    E: $data.showErrors && !$data.formData.description
  }, $data.showErrors && !$data.formData.description ? {
    F: common_vendor.t($data.formData.type === "repair" ? "问题描述" : "保养项目")
  } : {}, {
    G: $data.showErrors && !$options.isValidPhone ? 1 : "",
    H: $data.formData.phone,
    I: common_vendor.o(($event) => $data.formData.phone = $event.detail.value),
    J: $data.showErrors && !$data.formData.phone
  }, $data.showErrors && !$data.formData.phone ? {} : {}, {
    K: $data.showErrors && $data.formData.phone && !$options.isValidPhone
  }, $data.showErrors && $data.formData.phone && !$options.isValidPhone ? {} : {}, {
    L: common_vendor.t($data.isSubmitting ? "提交中..." : "提交预约"),
    M: $data.isSubmitting,
    N: common_vendor.o((...args) => $options.submitForm && $options.submitForm(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-990458ea"]]);
wx.createPage(MiniProgramPage);
