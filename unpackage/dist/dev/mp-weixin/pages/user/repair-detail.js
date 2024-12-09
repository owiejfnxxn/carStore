"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      recordId: "",
      record: null
    };
  },
  onLoad(options) {
    if (options.id) {
      this.recordId = options.id;
      this.loadRecord();
    }
  },
  methods: {
    loadRecord() {
      try {
        const records = common_vendor.index.getStorageSync("repairRecords") || [];
        this.record = records.find((r) => r.id == this.recordId);
        if (!this.record) {
          common_vendor.index.showToast({
            title: "记录不存在",
            icon: "none"
          });
          setTimeout(() => {
            common_vendor.index.navigateBack();
          }, 1500);
        }
      } catch (e) {
        console.error("获取记录失败:", e);
      }
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
    cancelRecord() {
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
                const index = records.findIndex((r) => r.id == this.recordId);
                if (index > -1) {
                  records[index].status = "cancelled";
                  records[index].cancelTime = (/* @__PURE__ */ new Date()).toLocaleString();
                  common_vendor.index.setStorageSync("repairRecords", records);
                  this.record.status = "cancelled";
                  this.record.cancelTime = records[index].cancelTime;
                  common_vendor.index.showToast({
                    title: "已取消预约",
                    icon: "success"
                  });
                  setTimeout(() => {
                    common_vendor.index.navigateBack();
                  }, 1500);
                }
              } catch (e) {
                console.error("更新记录失败:", e);
              }
            }, 1e3);
          }
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t($options.getTypeText($data.record.type)),
    b: common_vendor.n($data.record.type),
    c: common_vendor.t($options.getStatusText($data.record.status)),
    d: common_vendor.n($data.record.status),
    e: $data.record.status !== "cancelled"
  }, $data.record.status !== "cancelled" ? {
    f: common_vendor.t($data.record.createTime),
    g: common_vendor.t($data.record.confirmTime || "-"),
    h: ["confirmed", "completed"].includes($data.record.status) ? 1 : "",
    i: common_vendor.t($data.record.completeTime || "-"),
    j: $data.record.status === "completed" ? 1 : ""
  } : {}, {
    k: common_vendor.t($data.record.storeName),
    l: common_vendor.t($data.record.appointTime),
    m: common_vendor.t($data.record.phone),
    n: common_vendor.t($data.record.type === "repair" ? "问题描述" : "保养项目"),
    o: common_vendor.t($data.record.description),
    p: common_vendor.t($data.record.createTime),
    q: $data.record.confirmTime
  }, $data.record.confirmTime ? {
    r: common_vendor.t($data.record.confirmTime)
  } : {}, {
    s: $data.record.completeTime
  }, $data.record.completeTime ? {
    t: common_vendor.t($data.record.completeTime)
  } : {}, {
    v: $data.record.cancelTime
  }, $data.record.cancelTime ? {
    w: common_vendor.t($data.record.cancelTime)
  } : {}, {
    x: $data.record.status === "pending"
  }, $data.record.status === "pending" ? {
    y: common_vendor.o((...args) => $options.cancelRecord && $options.cancelRecord(...args))
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-4440f3eb"]]);
wx.createPage(MiniProgramPage);
