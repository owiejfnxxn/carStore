"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      recordList: [],
      page: 1,
      hasMore: true,
      isRefreshing: false
    };
  },
  onLoad() {
    const records = common_vendor.index.getStorageSync("repairRecords") || [];
    this.recordList = records;
    common_vendor.index.$on("updateRepairRecords", this.handleNewAppointment);
  },
  onUnload() {
    common_vendor.index.$off("updateRepairRecords", this.handleNewAppointment);
  },
  methods: {
    handleNewAppointment(appointment) {
      this.recordList.unshift(appointment);
    },
    getTypeText(type) {
      const typeMap = {
        repair: "维修",
        maintenance: "保养"
      };
      return typeMap[type] || type;
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
      if (!this.hasMore)
        return;
      this.page++;
      this.loadRecords();
    },
    onRefresh() {
      this.isRefreshing = true;
      this.page = 1;
      this.recordList = [];
      this.hasMore = true;
      this.loadRecords();
      setTimeout(() => {
        this.isRefreshing = false;
      }, 1e3);
    },
    loadRecords() {
      setTimeout(() => {
        const mockRecords = [
          // ... 可以添加更多模拟数据
        ];
        this.recordList = [...this.recordList, ...mockRecords];
        this.hasMore = this.page < 3;
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
                const records = common_vendor.index.getStorageSync("repairRecords") || [];
                const index = records.findIndex((r) => r.id === record.id);
                if (index > -1) {
                  records[index].status = "cancelled";
                  records[index].cancelTime = (/* @__PURE__ */ new Date()).toLocaleString();
                  common_vendor.index.setStorageSync("repairRecords", records);
                  record.status = "cancelled";
                  record.cancelTime = records[index].cancelTime;
                }
              } catch (e) {
                console.error("更新记录失败:", e);
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
        url: `/pages/user/repair-detail?id=${record.id}`
      });
    },
    goToAdd() {
      common_vendor.index.navigateTo({
        url: "/pages/user/repair-add"
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.f($data.recordList, (record, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t($options.getTypeText(record.type)),
        b: common_vendor.n(record.type),
        c: common_vendor.t($options.getStatusText(record.status)),
        d: common_vendor.n(record.status),
        e: common_vendor.t(record.storeName),
        f: common_vendor.t(record.appointTime),
        g: common_vendor.t(record.description),
        h: common_vendor.t(record.createTime),
        i: record.status === "pending"
      }, record.status === "pending" ? {
        j: common_vendor.o(($event) => $options.cancelRecord(record), index)
      } : {}, {
        k: common_vendor.o(($event) => $options.viewDetail(record), index),
        l: index
      });
    }),
    b: $data.recordList.length === 0
  }, $data.recordList.length === 0 ? {
    c: common_assets._imports_0$1,
    d: common_vendor.o((...args) => $options.goToAdd && $options.goToAdd(...args))
  } : {}, {
    e: $data.recordList.length > 0
  }, $data.recordList.length > 0 ? common_vendor.e({
    f: $data.hasMore
  }, $data.hasMore ? {} : {}) : {}, {
    g: common_vendor.o((...args) => $options.loadMore && $options.loadMore(...args)),
    h: $data.isRefreshing,
    i: common_vendor.o((...args) => $options.onRefresh && $options.onRefresh(...args)),
    j: $data.recordList.length > 0
  }, $data.recordList.length > 0 ? {
    k: common_vendor.o((...args) => $options.goToAdd && $options.goToAdd(...args))
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-f7a17f08"]]);
wx.createPage(MiniProgramPage);
