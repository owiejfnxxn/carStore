"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      statusTabs: [
        { name: "全部", value: "all" },
        { name: "待付款", value: "pending" },
        { name: "已付款", value: "paid" },
        { name: "退款中", value: "refunding" },
        { name: "已完成", value: "completed" },
        { name: "已取消", value: "cancelled" }
      ],
      currentTab: 0,
      allOrders: [
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
      ],
      orderList: [],
      page: 1,
      hasMore: true,
      isRefreshing: false
    };
  },
  onLoad() {
    this.loadOrders();
    common_vendor.index.$on("orderStatusChanged", this.handleOrderStatusChange);
  },
  onUnload() {
    common_vendor.index.$off("orderStatusChanged", this.handleOrderStatusChange);
  },
  methods: {
    switchTab(index) {
      if (this.currentTab === index)
        return;
      this.currentTab = index;
      this.page = 1;
      this.filterOrders();
      this.hasMore = true;
    },
    filterOrders() {
      const status = this.statusTabs[this.currentTab].value;
      const filteredOrders = status === "all" ? this.allOrders : this.allOrders.filter((order) => order.status === status);
      const pageSize = 10;
      const start = (this.page - 1) * pageSize;
      const end = this.page * pageSize;
      const pageOrders = filteredOrders.slice(start, end);
      if (this.page === 1) {
        this.orderList = pageOrders;
      } else {
        this.orderList = [...this.orderList, ...pageOrders];
      }
      this.hasMore = end < filteredOrders.length;
    },
    loadOrders() {
      setTimeout(() => {
        this.filterOrders();
      }, 1e3);
    },
    loadMore() {
      if (!this.hasMore)
        return;
      this.page++;
      this.loadOrders();
    },
    onRefresh() {
      this.isRefreshing = true;
      this.page = 1;
      this.hasMore = true;
      this.loadOrders();
      setTimeout(() => {
        this.isRefreshing = false;
      }, 1e3);
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
    cancelOrder(order) {
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
              order.status = "cancelled";
              order.cancelTime = (/* @__PURE__ */ new Date()).toLocaleString();
              this.filterOrders();
            }, 1e3);
          }
        }
      });
    },
    applyRefund(order) {
      common_vendor.index.showModal({
        title: "申请退款",
        content: "确定要申请退款吗？退款将在1-3个工作日内处理。",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.showLoading({ title: "提交中..." });
            setTimeout(() => {
              common_vendor.index.hideLoading();
              common_vendor.index.showToast({
                title: "申请已提交",
                icon: "success"
              });
              order.status = "refunding";
              order.refundTime = (/* @__PURE__ */ new Date()).toLocaleString();
              this.filterOrders();
            }, 1500);
          }
        }
      });
    },
    viewDetail(order) {
      common_vendor.index.navigateTo({
        url: `/pages/user/order-detail?orderNo=${order.orderNo}`,
        fail: () => {
          common_vendor.index.showToast({
            title: "跳转失败",
            icon: "none"
          });
        }
      });
    },
    handleOrderStatusChange(data) {
      const order = this.allOrders.find((o) => o.orderNo === data.orderNo);
      if (order) {
        order.status = data.status;
        if (data.payTime)
          order.payTime = data.payTime;
        if (data.refundTime)
          order.refundTime = data.refundTime;
        this.filterOrders();
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.f($data.statusTabs, (tab, index, i0) => {
      return {
        a: common_vendor.t(tab.name),
        b: index,
        c: $data.currentTab === index ? 1 : "",
        d: common_vendor.o(($event) => $options.switchTab(index), index)
      };
    }),
    b: common_vendor.f($data.orderList, (order, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(order.orderNo),
        b: common_vendor.t($options.getStatusText(order.status)),
        c: common_vendor.n(order.status),
        d: order.productImage,
        e: common_vendor.t(order.productName),
        f: common_vendor.t(order.color),
        g: common_vendor.t(order.config),
        h: common_vendor.t(order.deposit),
        i: common_vendor.t(order.totalPrice),
        j: common_vendor.t(order.createTime),
        k: order.status === "pending"
      }, order.status === "pending" ? {
        l: common_vendor.o(($event) => $options.cancelOrder(order), index)
      } : {}, {
        m: order.status === "paid"
      }, order.status === "paid" ? {
        n: common_vendor.o(($event) => $options.applyRefund(order), index)
      } : {}, {
        o: common_vendor.o(($event) => $options.viewDetail(order), index),
        p: index
      });
    }),
    c: $data.orderList.length === 0
  }, $data.orderList.length === 0 ? {} : {}, {
    d: common_vendor.o((...args) => $options.loadMore && $options.loadMore(...args)),
    e: $data.isRefreshing,
    f: common_vendor.o((...args) => $options.onRefresh && $options.onRefresh(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-506ae539"]]);
wx.createPage(MiniProgramPage);
