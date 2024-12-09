"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      userInfo: {
        nickname: "",
        userId: "",
        avatar: "https://via.placeholder.com/80x80",
        level: 1,
        points: 0
      },
      isLogin: common_vendor.index.getStorageSync("isLoggedIn") || false,
      menuList: [
        { name: "购车订单", icon: "icon-order", type: "order" },
        { name: "预约试驾", icon: "icon-test-drive", type: "test-drive" },
        { name: "维修保养", icon: "icon-repair", type: "repair" },
        { name: "积分中心", icon: "icon-points", type: "points" }
      ],
      listMenu: [
        { name: "个人资料", icon: "icon-profile", type: "profile", public: false },
        { name: "客服热线", icon: "icon-service", type: "service", public: true },
        { name: "关于我们", icon: "icon-about", type: "about", public: true }
      ]
    };
  },
  onShow() {
    const userInfo = common_vendor.index.getStorageSync("userInfo");
    this.isLogin = common_vendor.index.getStorageSync("isLoggedIn");
    this.updateUserInfo(userInfo);
  },
  onLoad() {
    common_vendor.index.$on("loginSuccess", this.updateUserInfo);
  },
  onUnload() {
    common_vendor.index.$off("loginSuccess", this.updateUserInfo);
  },
  methods: {
    goToLogin() {
      common_vendor.index.navigateTo({
        url: "/pages/login/index"
      });
    },
    handleMenu(item) {
      if (!this.isLogin) {
        this.goToLogin();
        return;
      }
      switch (item.type) {
        case "order":
          common_vendor.index.navigateTo({ url: "/pages/user/order" });
          break;
        case "test-drive":
          common_vendor.index.navigateTo({
            url: "/pages/user/test-drive-list",
            fail: () => {
              common_vendor.index.showToast({
                title: "跳转失败",
                icon: "none"
              });
            }
          });
          break;
        case "repair":
          common_vendor.index.navigateTo({ url: "/pages/user/repair" });
          break;
        case "points":
          common_vendor.index.navigateTo({ url: "/pages/user/points" });
          break;
      }
    },
    handleListMenu(item) {
      if (!this.isLogin && !item.public) {
        this.goToLogin();
        return;
      }
      switch (item.type) {
        case "profile":
          common_vendor.index.navigateTo({ url: "/pages/user/profile" });
          break;
        case "service":
          common_vendor.index.makePhoneCall({
            phoneNumber: "400-123-4567",
            fail() {
              common_vendor.index.showToast({
                title: "拨打失败，请稍后重试",
                icon: "none"
              });
            }
          });
          break;
        case "about":
          common_vendor.index.navigateTo({ url: "/pages/user/about" });
          break;
      }
    },
    handleLogout() {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要退出登录吗？",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.removeStorageSync("userInfo");
            common_vendor.index.removeStorageSync("isLoggedIn");
            this.isLogin = false;
            this.userInfo = {
              nickname: "",
              userId: "",
              avatar: "/static/default-avatar.png",
              level: 1,
              points: 0
            };
            common_vendor.index.showToast({
              title: "已退出登录",
              icon: "success"
            });
          }
        }
      });
    },
    updateUserInfo(userInfo) {
      if (userInfo) {
        this.userInfo = {
          nickname: userInfo.username,
          userId: Date.now().toString().slice(-6),
          avatar: "https://via.placeholder.com/80x80",
          level: 1,
          points: 0
        };
        this.isLogin = true;
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.isLogin
  }, $data.isLogin ? {
    b: $data.userInfo.avatar,
    c: common_vendor.t($data.userInfo.nickname),
    d: common_vendor.t($data.userInfo.userId),
    e: common_vendor.t($data.userInfo.level),
    f: common_vendor.t($data.userInfo.points)
  } : {
    g: common_vendor.o((...args) => $options.goToLogin && $options.goToLogin(...args))
  }, {
    h: common_vendor.t($data.isLogin ? "我的服务" : "全部服务"),
    i: common_vendor.f($data.menuList, (item, index, i0) => {
      return common_vendor.e({
        a: common_vendor.n(item.icon),
        b: common_vendor.t(item.name)
      }, !$data.isLogin ? {} : {}, {
        c: index,
        d: common_vendor.o(($event) => $options.handleMenu(item), index)
      });
    }),
    j: !$data.isLogin,
    k: common_vendor.f($data.listMenu, (item, index, i0) => {
      return {
        a: common_vendor.n(item.icon),
        b: common_vendor.t(item.name),
        c: index,
        d: common_vendor.o(($event) => $options.handleListMenu(item), index),
        e: !$data.isLogin && !item.public ? 1 : ""
      };
    }),
    l: $data.isLogin
  }, $data.isLogin ? {
    m: common_vendor.o((...args) => $options.handleLogout && $options.handleLogout(...args))
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-79e6a490"]]);
wx.createPage(MiniProgramPage);
