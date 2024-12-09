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
        const records = common_vendor.index.getStorageSync("testDriveRecords") || [];
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
    getStatusText(status) {
      const statusMap = {
        pending: "待确认",
        confirmed: "已确认",
        completed: "已完成",
        cancelled: "已取消"
      };
      return statusMap[status] || status;
    },
    getStatusDesc(status) {
      const descMap = {
        pending: "等待门店确认",
        confirmed: "门店已确认，请按时到店",
        completed: "试驾已完成",
        cancelled: "预约已取消"
      };
      return descMap[status] || "";
    },
    // 联系门店
    contactStore() {
      common_vendor.index.showActionSheet({
        itemList: ["拨打门店电话", "查看门店地址"],
        success: (res) => {
          switch (res.tapIndex) {
            case 0:
              common_vendor.index.makePhoneCall({
                phoneNumber: this.record.storePhone || "021-12345678",
                fail: () => {
                  common_vendor.index.showToast({
                    title: "拨打失败",
                    icon: "none"
                  });
                }
              });
              break;
            case 1:
              common_vendor.index.navigateTo({
                url: `/pages/spots/detail?id=${this.record.storeId}`
              });
              break;
          }
        }
      });
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
                const records = common_vendor.index.getStorageSync("testDriveRecords") || [];
                const index = records.findIndex((r) => r.id == this.recordId);
                if (index > -1) {
                  records[index].status = "cancelled";
                  records[index].cancelTime = (/* @__PURE__ */ new Date()).toLocaleString();
                  common_vendor.index.setStorageSync("testDriveRecords", records);
                }
                this.record.status = "cancelled";
                this.record.cancelTime = records[index].cancelTime;
                common_vendor.index.showToast({
                  title: "已取消预约",
                  icon: "success"
                });
                common_vendor.index.$emit("updateTestDriveList");
                setTimeout(() => {
                  common_vendor.index.navigateBack();
                }, 1500);
              } catch (e) {
                console.error("取消预约失败:", e);
                common_vendor.index.showToast({
                  title: "操作失败",
                  icon: "none"
                });
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
    a: common_vendor.t($options.getStatusText($data.record.status)),
    b: common_vendor.n($data.record.status),
    c: common_vendor.t($options.getStatusDesc($data.record.status)),
    d: $data.record.status !== "cancelled"
  }, $data.record.status !== "cancelled" ? {
    e: common_vendor.t($data.record.createTime),
    f: common_vendor.t($data.record.confirmTime || "-"),
    g: ["confirmed", "completed"].includes($data.record.status) ? 1 : "",
    h: common_vendor.t($data.record.completeTime || "-"),
    i: $data.record.status === "completed" ? 1 : ""
  } : {}, {
    j: $data.record.productImage,
    k: common_vendor.t($data.record.productName),
    l: common_vendor.t($data.record.storeName),
    m: common_vendor.o((...args) => $options.contactStore && $options.contactStore(...args)),
    n: common_vendor.t($data.record.driveTime),
    o: common_vendor.t($data.record.name),
    p: common_vendor.t($data.record.phone),
    q: $data.record.remark
  }, $data.record.remark ? {
    r: common_vendor.t($data.record.remark)
  } : {}, {
    s: common_vendor.t($data.record.createTime),
    t: $data.record.confirmTime
  }, $data.record.confirmTime ? {
    v: common_vendor.t($data.record.confirmTime)
  } : {}, {
    w: $data.record.completeTime
  }, $data.record.completeTime ? {
    x: common_vendor.t($data.record.completeTime)
  } : {}, {
    y: $data.record.cancelTime
  }, $data.record.cancelTime ? {
    z: common_vendor.t($data.record.cancelTime)
  } : {}, {
    A: $data.record.status === "pending"
  }, $data.record.status === "pending" ? {
    B: common_vendor.o((...args) => $options.cancelRecord && $options.cancelRecord(...args))
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-d342d4ad"]]);
wx.createPage(MiniProgramPage);
