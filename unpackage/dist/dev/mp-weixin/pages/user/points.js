"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      userPoints: 520,
      showRulesPopup: false,
      pointsWays: [
        {
          name: "购车成功",
          desc: "完成购车订单",
          points: 1e3,
          icon: "icon-car"
        },
        {
          name: "邀请好友",
          desc: "好友成功注册",
          points: 100,
          icon: "icon-invite"
        },
        {
          name: "评价服务",
          desc: "完成服务评价",
          points: 50,
          icon: "icon-comment"
        },
        {
          name: "分享商品",
          desc: "分享商品给好友",
          points: 10,
          icon: "icon-share"
        }
      ],
      pointsRecords: [
        {
          name: "购车奖励",
          time: "2024-01-20 12:00:00",
          points: 1e3
        },
        {
          name: "兑换礼品",
          time: "2024-01-19 15:30:00",
          points: -500
        }
      ],
      pointsRules: [
        {
          title: "积分获取",
          desc: "购车可获得订单金额1%的积分，1元=1积分"
        },
        {
          title: "积分有效期",
          desc: "积分自获得之日起有效期为一年"
        },
        {
          title: "积分使用",
          desc: "积分可用于商城兑换、保养抵扣等"
        },
        {
          title: "其他说明",
          desc: "积分不可转让，不可提现，最终解释权归本公司所有"
        }
      ],
      page: 1,
      hasMore: false,
      isRefreshing: false
    };
  },
  methods: {
    showRules() {
      this.showRulesPopup = true;
    },
    closeRules() {
      this.showRulesPopup = false;
    },
    showDetails() {
      common_vendor.index.navigateTo({
        url: "/pages/user/points-detail"
      });
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
      this.pointsRecords = [];
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
        this.pointsRecords = [...this.pointsRecords, ...mockRecords];
        this.hasMore = this.page < 3;
      }, 1e3);
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t($data.userPoints),
    b: common_vendor.o((...args) => $options.showRules && $options.showRules(...args)),
    c: common_vendor.o((...args) => $options.showDetails && $options.showDetails(...args)),
    d: common_vendor.f($data.pointsWays, (way, index, i0) => {
      return {
        a: common_vendor.n(way.icon),
        b: common_vendor.t(way.name),
        c: common_vendor.t(way.desc),
        d: common_vendor.t(way.points),
        e: index
      };
    }),
    e: common_vendor.f($data.pointsRecords, (record, index, i0) => {
      return {
        a: common_vendor.t(record.name),
        b: common_vendor.t(record.time),
        c: common_vendor.t(record.points > 0 ? "+" : ""),
        d: common_vendor.t(record.points),
        e: record.points < 0 ? 1 : "",
        f: index
      };
    }),
    f: $data.pointsRecords.length === 0
  }, $data.pointsRecords.length === 0 ? {
    g: common_assets._imports_0$2
  } : {}, {
    h: $data.pointsRecords.length > 0
  }, $data.pointsRecords.length > 0 ? common_vendor.e({
    i: $data.hasMore
  }, $data.hasMore ? {} : {}) : {}, {
    j: common_vendor.o((...args) => $options.loadMore && $options.loadMore(...args)),
    k: $data.isRefreshing,
    l: common_vendor.o((...args) => $options.onRefresh && $options.onRefresh(...args)),
    m: $data.showRulesPopup
  }, $data.showRulesPopup ? {
    n: common_vendor.o((...args) => $options.closeRules && $options.closeRules(...args)),
    o: common_vendor.o((...args) => $options.closeRules && $options.closeRules(...args)),
    p: common_vendor.f($data.pointsRules, (rule, index, i0) => {
      return {
        a: common_vendor.t(index + 1),
        b: common_vendor.t(rule.title),
        c: common_vendor.t(rule.desc),
        d: index
      };
    })
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-7b3baf1a"]]);
wx.createPage(MiniProgramPage);
