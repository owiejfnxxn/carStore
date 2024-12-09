"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      orderNo: "",
      orderInfo: null
    };
  },
  computed: {
    showActionBar() {
      var _a, _b;
      return ["pending", "paid"].includes((_a = this.orderInfo) == null ? void 0 : _a.status) && ((_b = this.orderInfo) == null ? void 0 : _b.status) !== "refunding";
    }
  },
  onLoad(options) {
    if (options.orderNo) {
      this.orderNo = options.orderNo;
      this.loadOrderDetail();
    }
  },
  methods: {
    loadOrderDetail() {
      const mockOrders = [
        {
          orderNo: "CF20240120001",
          status: "pending",
          productImage: "https://via.placeholder.com/200x200",
          productName: "2024款 春风NK400",
          color: "曜石黑",
          config: "豪华版",
          deposit: "5000",
          totalPrice: "68800",
          createTime: "2024-01-20 12:00:00"
        },
        {
          orderNo: "CF20240119001",
          status: "paid",
          productImage: "https://via.placeholder.com/200x200",
          productName: "2024款 春风NK250",
          color: "珍珠白",
          config: "运动版",
          deposit: "3000",
          totalPrice: "46800",
          createTime: "2024-01-19 15:30:00",
          payTime: "2024-01-19 15:35:00"
        },
        {
          orderNo: "CF20240118001",
          status: "completed",
          productImage: "https://via.placeholder.com/200x200",
          productName: "2024款 春风150NK",
          color: "赛道红",
          config: "标准版",
          deposit: "2000",
          totalPrice: "28800",
          createTime: "2024-01-18 10:00:00",
          payTime: "2024-01-18 10:05:00",
          completeTime: "2024-01-19 14:00:00"
        },
        {
          orderNo: "CF20240117001",
          status: "cancelled",
          productImage: "https://via.placeholder.com/200x200",
          productName: "2024款 春风400GT",
          color: "曜石黑",
          config: "豪华版",
          deposit: "5000",
          totalPrice: "72800",
          createTime: "2024-01-17 16:00:00",
          cancelTime: "2024-01-17 16:30:00"
        }
      ];
      this.orderInfo = mockOrders[this.orderNo] || null;
    },
    getStatusText(status) {
      const statusMap = {
        pending: "待付款",
        paid: "已付款",
        refunding: "退款中",
        completed: "已完成",
        cancelled: "已取消"
      };
      return statusMap[status] || status;
    },
    getStatusDesc(status) {
      const descMap = {
        pending: "请在24小时内完成支付",
        paid: "定金已支付，请等待提车通知",
        refunding: "退款申请已提交，请等待处理",
        completed: "订单已完成",
        cancelled: "订单已取消"
      };
      return descMap[status] || "";
    },
    cancelOrder() {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要取消该订单吗？",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.showLoading({ title: "处理中..." });
            setTimeout(() => {
              common_vendor.index.hideLoading();
              common_vendor.index.showToast({
                title: "订单已取消",
                icon: "success"
              });
              this.orderInfo.status = "cancelled";
              this.orderInfo.cancelTime = (/* @__PURE__ */ new Date()).toLocaleString();
            }, 1e3);
          }
        }
      });
    },
    applyRefund() {
      common_vendor.index.showModal({
        title: "退款提示",
        content: "确定申请退款吗？退款将在1-3个工作日内处理。",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.showLoading({ title: "提交中..." });
            setTimeout(() => {
              common_vendor.index.hideLoading();
              common_vendor.index.showToast({
                title: "申请已提交",
                icon: "success"
              });
              this.orderInfo.status = "refunding";
              this.orderInfo.refundTime = (/* @__PURE__ */ new Date()).toLocaleString();
              common_vendor.index.$emit("orderStatusChanged", {
                orderNo: this.orderInfo.orderNo,
                status: "refunding",
                refundTime: this.orderInfo.refundTime
              });
              setTimeout(() => {
                common_vendor.index.navigateBack();
              }, 1500);
            }, 1500);
          }
        }
      });
    },
    goPay() {
      common_vendor.index.showModal({
        title: "支付提示",
        content: `确定支付定金 ¥${this.orderInfo.deposit} 吗？`,
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.showLoading({ title: "支付中..." });
            setTimeout(() => {
              common_vendor.index.hideLoading();
              common_vendor.index.showToast({
                title: "支付成功",
                icon: "success"
              });
              this.orderInfo.status = "paid";
              this.orderInfo.payTime = (/* @__PURE__ */ new Date()).toLocaleString();
              common_vendor.index.$emit("orderStatusChanged", {
                orderNo: this.orderInfo.orderNo,
                status: "paid",
                payTime: this.orderInfo.payTime
              });
              setTimeout(() => {
                common_vendor.index.navigateBack();
              }, 1500);
            }, 2e3);
          }
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t($options.getStatusText($data.orderInfo.status)),
    b: common_vendor.n($data.orderInfo.status),
    c: common_vendor.t($options.getStatusDesc($data.orderInfo.status)),
    d: $data.orderInfo.status !== "cancelled"
  }, $data.orderInfo.status !== "cancelled" ? common_vendor.e({
    e: common_vendor.t($data.orderInfo.createTime),
    f: $data.orderInfo.status !== "pending" ? 1 : "",
    g: common_vendor.t($data.orderInfo.payTime || "-"),
    h: ["paid", "refunding", "completed"].includes($data.orderInfo.status) ? 1 : "",
    i: $data.orderInfo.status === "refunding"
  }, $data.orderInfo.status === "refunding" ? {
    j: common_vendor.t($data.orderInfo.refundTime || "-")
  } : {}, {
    k: $data.orderInfo.status !== "refunding"
  }, $data.orderInfo.status !== "refunding" ? {
    l: common_vendor.t($data.orderInfo.completeTime || "-"),
    m: $data.orderInfo.status === "completed" ? 1 : ""
  } : {
    n: common_vendor.t($data.orderInfo.refundTime || "-"),
    o: $data.orderInfo.status === "refunding" ? 1 : ""
  }) : {}, {
    p: $data.orderInfo.productImage,
    q: common_vendor.t($data.orderInfo.productName),
    r: common_vendor.t($data.orderInfo.color),
    s: common_vendor.t($data.orderInfo.config),
    t: common_vendor.t($data.orderInfo.deposit),
    v: common_vendor.t($data.orderInfo.totalPrice),
    w: common_vendor.t($data.orderInfo.orderNo),
    x: common_vendor.t($data.orderInfo.createTime),
    y: $data.orderInfo.payTime
  }, $data.orderInfo.payTime ? {
    z: common_vendor.t($data.orderInfo.payTime)
  } : {}, {
    A: $data.orderInfo.completeTime
  }, $data.orderInfo.completeTime ? {
    B: common_vendor.t($data.orderInfo.completeTime)
  } : {}, {
    C: $data.orderInfo.cancelTime
  }, $data.orderInfo.cancelTime ? {
    D: common_vendor.t($data.orderInfo.cancelTime)
  } : {}, {
    E: $data.orderInfo.refundTime
  }, $data.orderInfo.refundTime ? {
    F: common_vendor.t($data.orderInfo.refundTime)
  } : {}, {
    G: common_vendor.t($data.orderInfo.city || "上海"),
    H: common_vendor.t($data.orderInfo.store || "浦东店"),
    I: common_vendor.t($data.orderInfo.phone || "021-12345678"),
    J: $options.showActionBar
  }, $options.showActionBar ? common_vendor.e({
    K: $data.orderInfo.status === "pending"
  }, $data.orderInfo.status === "pending" ? {
    L: common_vendor.o((...args) => $options.cancelOrder && $options.cancelOrder(...args))
  } : {}, {
    M: $data.orderInfo.status === "paid" && $data.orderInfo.status !== "refunding"
  }, $data.orderInfo.status === "paid" && $data.orderInfo.status !== "refunding" ? {
    N: common_vendor.o((...args) => $options.applyRefund && $options.applyRefund(...args))
  } : {}, {
    O: $data.orderInfo.status === "pending"
  }, $data.orderInfo.status === "pending" ? {
    P: common_vendor.o((...args) => $options.goPay && $options.goPay(...args))
  } : {}) : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-29badeee"]]);
wx.createPage(MiniProgramPage);
