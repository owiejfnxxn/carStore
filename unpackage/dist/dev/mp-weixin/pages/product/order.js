"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      productInfo: {
        image: "",
        name: "",
        price: ""
      },
      // 颜色选项
      colors: [
        { name: "曜石黑", value: "#000000" },
        { name: "珍珠白", value: "#FFFFFF" },
        { name: "赛道红", value: "#FF0000" }
      ],
      selectedColor: "",
      // 配置选项
      configs: [
        { name: "标准版", price: "0" },
        { name: "运动版", price: "2000" },
        { name: "豪华版", price: "5000" }
      ],
      selectedConfig: "",
      // 定金
      deposit: "5000",
      // 表单数据
      formData: {
        name: "",
        idCard: "",
        phone: ""
      },
      // 城市和门店
      cities: ["北京", "上海", "广州", "深圳"],
      cityIndex: -1,
      storeIndex: -1,
      storeMap: {
        "北京": ["朝阳店", "海淀店", "丰台店"],
        "上海": ["浦东店", "静安店", "徐汇店"],
        "广州": ["天河店", "越秀店", "海珠店"],
        "深圳": ["南山店", "福田店", "罗湖店"]
      },
      isAgreed: false,
      showErrors: false,
      // 购车须知
      agreementText: `
        1. 订购流程说明
        - 支付定金后订单生效
        - 定金不可退
        - 提车时需支付全款
        
        2. 所需材料
        - 身份证原件
        - 驾驶证
        - 购车款项
        
        3. 保修政策
        - 整车保修2年
        - 发动机核心部件保修3年
        
        4. 其他说明
        - 具体配置以实车为准
        - 提车时间可能因各种因素产生变动
        - 本公司保留最终解释权
      `,
      showAgreementPopup: false
    };
  },
  computed: {
    currentStores() {
      return this.cityIndex >= 0 ? this.storeMap[this.cities[this.cityIndex]] : [];
    },
    isValidPhone() {
      return /^1[3-9]\d{9}$/.test(this.formData.phone);
    },
    isValidIdCard() {
      return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(this.formData.idCard);
    },
    canSubmit() {
      return this.formData.name && this.isValidIdCard && this.cityIndex >= 0 && this.storeIndex >= 0 && this.isValidPhone && this.selectedColor && this.selectedConfig && this.isAgreed;
    }
  },
  onLoad(options) {
    if (options.id) {
      this.productInfo = {
        image: "https://via.placeholder.com/300x200",
        name: "2024款 春风NK400",
        price: "68800"
      };
    }
  },
  methods: {
    selectColor(color) {
      this.selectedColor = color;
    },
    selectConfig(config) {
      this.selectedConfig = config;
    },
    handleCityChange(e) {
      this.cityIndex = e.detail.value;
      this.storeIndex = -1;
    },
    handleStoreChange(e) {
      this.storeIndex = e.detail.value;
    },
    handleAgreementChange(e) {
      this.isAgreed = e.detail.value.length > 0;
    },
    showAgreement() {
      this.showAgreementPopup = true;
    },
    closeAgreement() {
      this.showAgreementPopup = false;
    },
    handlePopupChange(e) {
      this.showAgreementPopup = e.show;
    },
    validateForm() {
      this.showErrors = true;
      if (!this.formData.name)
        return false;
      if (!this.isValidIdCard)
        return false;
      if (this.cityIndex < 0)
        return false;
      if (this.storeIndex < 0)
        return false;
      if (!this.isValidPhone)
        return false;
      if (!this.selectedColor)
        return false;
      if (!this.selectedConfig)
        return false;
      if (!this.isAgreed)
        return false;
      return true;
    },
    submitOrder() {
      if (!this.validateForm())
        return;
      common_vendor.index.showLoading({ title: "提交中..." });
      setTimeout(() => {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "订单提交成功",
          icon: "success"
        });
        setTimeout(() => {
          common_vendor.index.redirectTo({
            url: `/pages/order/detail?id=${Date.now()}`
          });
        }, 1500);
      }, 1500);
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.productInfo.image,
    b: common_vendor.t($data.productInfo.name),
    c: common_vendor.t($data.productInfo.price),
    d: common_vendor.f($data.colors, (color, index, i0) => {
      return {
        a: color.value,
        b: common_vendor.t(color.name),
        c: index,
        d: $data.selectedColor === color.name ? 1 : "",
        e: common_vendor.o(($event) => $options.selectColor(color.name), index)
      };
    }),
    e: common_vendor.f($data.configs, (config, index, i0) => {
      return {
        a: common_vendor.t(config.name),
        b: common_vendor.t(config.price),
        c: index,
        d: $data.selectedConfig === config.name ? 1 : "",
        e: common_vendor.o(($event) => $options.selectConfig(config.name), index)
      };
    }),
    f: common_vendor.t($data.deposit),
    g: $data.showErrors && !$data.formData.name ? 1 : "",
    h: $data.formData.name,
    i: common_vendor.o(($event) => $data.formData.name = $event.detail.value),
    j: $data.showErrors && !$data.formData.name
  }, $data.showErrors && !$data.formData.name ? {} : {}, {
    k: $data.showErrors && !$options.isValidIdCard ? 1 : "",
    l: $data.formData.idCard,
    m: common_vendor.o(($event) => $data.formData.idCard = $event.detail.value),
    n: $data.showErrors && !$data.formData.idCard
  }, $data.showErrors && !$data.formData.idCard ? {} : {}, {
    o: $data.showErrors && $data.formData.idCard && !$options.isValidIdCard
  }, $data.showErrors && $data.formData.idCard && !$options.isValidIdCard ? {} : {}, {
    p: common_vendor.t($data.cities[$data.cityIndex] || "请选择城市"),
    q: common_vendor.o((...args) => $options.handleCityChange && $options.handleCityChange(...args)),
    r: $data.cityIndex,
    s: $data.cities,
    t: $data.showErrors && $data.cityIndex < 0 ? 1 : "",
    v: $data.showErrors && $data.cityIndex < 0
  }, $data.showErrors && $data.cityIndex < 0 ? {} : {}, {
    w: common_vendor.t($options.currentStores[$data.storeIndex] || "请选择门店"),
    x: common_vendor.o((...args) => $options.handleStoreChange && $options.handleStoreChange(...args)),
    y: $data.storeIndex,
    z: $options.currentStores,
    A: $data.cityIndex < 0,
    B: $data.showErrors && $data.cityIndex >= 0 && $data.storeIndex < 0 ? 1 : "",
    C: $data.showErrors && $data.cityIndex >= 0 && $data.storeIndex < 0
  }, $data.showErrors && $data.cityIndex >= 0 && $data.storeIndex < 0 ? {} : {}, {
    D: $data.showErrors && !$options.isValidPhone ? 1 : "",
    E: $data.formData.phone,
    F: common_vendor.o(($event) => $data.formData.phone = $event.detail.value),
    G: $data.showErrors && !$data.formData.phone
  }, $data.showErrors && !$data.formData.phone ? {} : {}, {
    H: $data.showErrors && $data.formData.phone && !$options.isValidPhone
  }, $data.showErrors && $data.formData.phone && !$options.isValidPhone ? {} : {}, {
    I: $data.isAgreed,
    J: common_vendor.o((...args) => $options.showAgreement && $options.showAgreement(...args)),
    K: common_vendor.o((...args) => $options.handleAgreementChange && $options.handleAgreementChange(...args)),
    L: common_vendor.t($data.deposit),
    M: !$options.canSubmit,
    N: common_vendor.o((...args) => $options.submitOrder && $options.submitOrder(...args)),
    O: $data.showAgreementPopup
  }, $data.showAgreementPopup ? {
    P: common_vendor.o((...args) => $options.closeAgreement && $options.closeAgreement(...args)),
    Q: common_vendor.t($data.agreementText),
    R: common_vendor.o((...args) => $options.closeAgreement && $options.closeAgreement(...args)),
    S: common_vendor.o(() => {
    }),
    T: common_vendor.o((...args) => $options.closeAgreement && $options.closeAgreement(...args))
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-3658be35"]]);
wx.createPage(MiniProgramPage);
