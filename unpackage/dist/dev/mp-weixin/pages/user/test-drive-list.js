"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      recordList: [
        // ... 可以添加更多记录
      ],
      page: 1,
      hasMore: true,
      isRefreshing: false
    };
  },
  onLoad() {
    this.loadLocalRecords();
    common_vendor.index.$on("updateTestDriveList", this.loadLocalRecords);
  },
  onUnload() {
    common_vendor.index.$off("updateTestDriveList", this.loadLocalRecords);
  },
  methods: {
    loadLocalRecords() {
      try {
        const records = common_vendor.index.getStorageSync("testDriveRecords") || [];
        this.recordList = records.sort((a, b) => {
          return new Date(b.createTime) - new Date(a.createTime);
        });
      } catch (e) {
        console.error("获取记录失败:", e);
      }
    },
    getStatusText(status) {
      const statusMap = {
        pending: "待确认",
        confirmed: "已确认",
        completed: "已完成",
        cancelled: "已取消"
      };
      return statusMap[status] || status;
    },
    loadMore() {
      this.hasMore = false;
    },
    onRefresh() {
      this.isRefreshing = true;
      this.loadLocalRecords();
      setTimeout(() => {
        this.isRefreshing = false;
      }, 1e3);
    },
    cancelRecord(record) {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要取消预约吗？",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.showLoading({ title: "处理中..." });
            setTimeout(() => {
              common_vendor.index.hideLoading();
              try {
                const records = common_vendor.index.getStorageSync("testDriveRecords") || [];
                const index = records.findIndex((r) => r.id === record.id);
                if (index > -1) {
                  records[index].status = "cancelled";
                  records[index].cancelTime = (/* @__PURE__ */ new Date()).toLocaleString();
                  common_vendor.index.setStorageSync("testDriveRecords", records);
                  record.status = "cancelled";
                  record.cancelTime = records[index].cancelTime;
                }
              } catch (e) {
                console.error("取消预约失败:", e);
              }
              common_vendor.index.showToast({
                title: "已取消预约",
                icon: "success"
              });
            }, 1e3);
          }
        }
      });
    },
    viewDetail(record) {
      common_vendor.index.navigateTo({
        url: `/pages/user/test-drive-detail?id=${record.id}`,
        fail: () => {
          common_vendor.index.showToast({
            title: "跳转失败",
            icon: "none"
          });
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.f($data.recordList, (record, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t($options.getStatusText(record.status)),
        b: common_vendor.n(record.status),
        c: common_vendor.t(record.createTime),
        d: record.productImage,
        e: common_vendor.t(record.productName),
        f: common_vendor.t(record.storeName),
        g: common_vendor.t(record.driveTime),
        h: record.status === "pending"
      }, record.status === "pending" ? {
        i: common_vendor.o(($event) => $options.cancelRecord(record), index)
      } : {}, {
        j: common_vendor.o(($event) => $options.viewDetail(record), index),
        k: index
      });
    }),
    b: $data.recordList.length === 0
  }, $data.recordList.length === 0 ? {
    c: common_assets._imports_0
  } : {}, {
    d: $data.recordList.length > 0
  }, $data.recordList.length > 0 ? common_vendor.e({
    e: $data.hasMore
  }, $data.hasMore ? {} : {}) : {}, {
    f: common_vendor.o((...args) => $options.loadMore && $options.loadMore(...args)),
    g: $data.isRefreshing,
    h: common_vendor.o((...args) => $options.onRefresh && $options.onRefresh(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-493401dc"]]);
wx.createPage(MiniProgramPage);
