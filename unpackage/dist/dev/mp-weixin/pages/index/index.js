"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      bannerList: [
        { id: 1, title: "2024新款NK400现货发售" },
        { id: 2, title: "春风摩托全系特惠" },
        { id: 3, title: "骑行装备限时折扣" }
      ]
    };
  },
  methods: {
    goToDetail(id) {
      common_vendor.index.navigateTo({
        url: `/pages/product/detail?id=${id}`
      });
    },
    goToProductList() {
      common_vendor.index.navigateTo({
        url: "/pages/product/list"
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($data.bannerList, (item, index, i0) => {
      return {
        a: common_vendor.t(item.title),
        b: index,
        c: common_vendor.o(($event) => $options.goToDetail(item.id), index)
      };
    }),
    b: common_vendor.o((...args) => $options.goToProductList && $options.goToProductList(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-1cf27b2a"]]);
wx.createPage(MiniProgramPage);
