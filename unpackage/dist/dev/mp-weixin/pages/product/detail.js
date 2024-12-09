"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      productId: "",
      isFavorite: false,
      // 城市和门店数据
      cities: ["北京", "上海", "广州", "深圳"],
      cityIndex: -1,
      storeIndex: -1,
      storeMap: {
        "北京": ["朝阳店", "海淀店", "丰台店"],
        "上海": ["浦东店", "静安店", "徐汇店"],
        "广州": ["天河店", "越秀店", "海珠店"],
        "深圳": ["南山店", "福田店", "罗湖店"]
      },
      // 商品详情
      productInfo: {
        images: [
          "https://via.placeholder.com/750x500",
          "https://via.placeholder.com/750x500",
          "https://via.placeholder.com/750x500"
        ],
        price: "68800",
        originalPrice: "72800",
        sales: 326,
        title: "2024款 春风NK400 街车摩托车",
        tags: ["摩托车", "街车", "春风"],
        specs: [
          { label: "品牌", value: "春风" },
          { label: "型号", value: "NK400" },
          { label: "类型", value: "街车" },
          { label: "排量", value: "400cc" },
          { label: "发动机", value: "水冷四冲程" },
          { label: "最大功率", value: "32kW" },
          { label: "最大扭矩", value: "38Nm" },
          { label: "车重", value: "195kg" },
          { label: "油箱容量", value: "17L" },
          { label: "轮胎规格", value: "前120/70-17M/C 54H，后160/60-17M/C 66H" }
        ],
        details: [
          { image: "https://via.placeholder.com/750x500", desc: "机车外观" },
          { image: "https://via.placeholder.com/750x500", desc: "发动机细节" },
          { image: "https://via.placeholder.com/750x500", desc: "骑行体验" }
        ]
      },
      showErrors: false,
      isSubmitting: false
    };
  },
  computed: {
    startDate() {
      const date = /* @__PURE__ */ new Date();
      return date.toISOString().split("T")[0];
    },
    currentStores() {
      return this.cityIndex >= 0 ? this.storeMap[this.cities[this.cityIndex]] : [];
    }
  },
  methods: {
    handleShare() {
      common_vendor.index.showShareMenu({
        withShareTicket: true
      });
    },
    handleService() {
      common_vendor.index.showToast({
        title: "正在接入客服...",
        icon: "none"
      });
    },
    toggleFavorite() {
      this.isFavorite = !this.isFavorite;
      common_vendor.index.showToast({
        title: this.isFavorite ? "收成功" : "已取消收藏",
        icon: "success"
      });
    },
    goToCart() {
      common_vendor.index.switchTab({
        url: "/pages/cart/index"
      });
    },
    addToCart() {
      common_vendor.index.showLoading({
        title: "正在加入..."
      });
      setTimeout(() => {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "已加入购物车",
          icon: "success"
        });
        this.cartCount++;
      }, 1e3);
    },
    buyNow() {
      const isLoggedIn = common_vendor.index.getStorageSync("isLoggedIn");
      if (!isLoggedIn) {
        common_vendor.index.showModal({
          title: "提示",
          content: "请先登录后再进行购买",
          success: (res) => {
            if (res.confirm) {
              common_vendor.index.navigateTo({ url: "/pages/login/index" });
            }
          }
        });
        return;
      }
      common_vendor.index.navigateTo({
        url: `/pages/product/order?id=${this.productId}`
      });
    },
    // 预约试驾相关方法
    showTestDrive() {
      common_vendor.index.navigateTo({
        url: `/pages/product/test-drive?id=${this.productId}`
      });
    },
    handleCityChange(e) {
      this.cityIndex = e.detail.value;
      this.storeIndex = -1;
    },
    handleStoreChange(e) {
      this.storeIndex = e.detail.value;
    },
    handleDateChange(e) {
      this.testDriveForm.date = e.detail.value;
    },
    closeTestDrive() {
      if (this.isSubmitting)
        return;
      this.$refs.testDrivePopup.close();
    },
    submitTestDrive() {
      if (this.isSubmitting)
        return;
      if (!this.validateTestDriveForm())
        return;
      this.isSubmitting = true;
      common_vendor.index.showLoading({ title: "提交中..." });
      setTimeout(() => {
        common_vendor.index.hideLoading();
        this.isSubmitting = false;
        common_vendor.index.showToast({
          title: "预约成功",
          icon: "success"
        });
        this.$refs.testDrivePopup.close();
        this.resetTestDriveForm();
      }, 1500);
    },
    resetTestDriveForm() {
      this.testDriveForm = {
        name: "",
        phone: "",
        date: ""
      };
      this.cityIndex = -1;
      this.storeIndex = -1;
      this.showErrors = false;
    },
    validateTestDriveForm() {
      this.showErrors = true;
      if (!this.testDriveForm.name)
        return false;
      if (this.cityIndex < 0)
        return false;
      if (this.storeIndex < 0)
        return false;
      if (!this.testDriveForm.date)
        return false;
      if (!this.testDriveForm.phone)
        return false;
      if (!this.isValidPhone)
        return false;
      return true;
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($data.productInfo.images, (item, index, i0) => {
      return {
        a: item,
        b: index
      };
    }),
    b: common_vendor.t($data.productInfo.price),
    c: common_vendor.t($data.productInfo.originalPrice),
    d: common_vendor.t($data.productInfo.sales),
    e: common_vendor.t($data.productInfo.title),
    f: common_vendor.o((...args) => $options.handleShare && $options.handleShare(...args)),
    g: common_vendor.f($data.productInfo.tags, (tag, index, i0) => {
      return {
        a: common_vendor.t(tag),
        b: index
      };
    }),
    h: common_vendor.f($data.productInfo.specs, (spec, index, i0) => {
      return {
        a: common_vendor.t(spec.label),
        b: common_vendor.t(spec.value),
        c: index
      };
    }),
    i: common_vendor.f($data.productInfo.details, (item, index, i0) => {
      return {
        a: item.image,
        b: common_vendor.t(item.desc),
        c: index
      };
    }),
    j: common_vendor.o((...args) => $options.showTestDrive && $options.showTestDrive(...args)),
    k: common_vendor.o((...args) => $options.buyNow && $options.buyNow(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-acf502d9"]]);
wx.createPage(MiniProgramPage);
