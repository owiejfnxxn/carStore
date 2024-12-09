"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      latitude: 31.230416,
      longitude: 121.473701,
      markers: [],
      showStoreDetail: false,
      currentStore: null,
      storeList: [
        {
          id: 1,
          name: "春风上海浦东店",
          latitude: 31.230416,
          longitude: 121.473701,
          address: "上海市浦东新区xx路xx号",
          phone: "021-12345678",
          serviceName: "张经理",
          servicePhone: "138xxxx1234",
          level: "A",
          hasFinance: true,
          canRegister: true,
          images: [
            "https://via.placeholder.com/600x400",
            "https://via.placeholder.com/600x400"
          ],
          services: [
            { name: "整车销售", icon: "icon-sale" },
            { name: "维修保养", icon: "icon-repair" },
            { name: "金融分期", icon: "icon-finance" },
            { name: "代客上牌", icon: "icon-register" }
          ]
        },
        {
          id: 2,
          name: "春风上海静安店",
          latitude: 31.235123,
          longitude: 121.456789,
          address: "上海市静安区xx路xx号",
          phone: "021-87654321",
          serviceName: "李经理",
          servicePhone: "137xxxx5678",
          level: "A",
          hasFinance: true,
          canRegister: true,
          images: [
            "https://via.placeholder.com/600x400",
            "https://via.placeholder.com/600x400"
          ],
          services: [
            { name: "整车销售", icon: "icon-sale" },
            { name: "维修保养", icon: "icon-repair" },
            { name: "金融分期", icon: "icon-finance" },
            { name: "代客上牌", icon: "icon-register" }
          ]
        },
        {
          id: 3,
          name: "春风上海徐汇店",
          latitude: 31.198123,
          longitude: 121.436789,
          address: "上海市徐汇区xx路xx号",
          phone: "021-76543210",
          serviceName: "王经理",
          servicePhone: "136xxxx9012",
          level: "B",
          hasFinance: true,
          canRegister: false,
          images: [
            "https://via.placeholder.com/600x400"
          ],
          services: [
            { name: "整车销售", icon: "icon-sale" },
            { name: "维修保养", icon: "icon-repair" },
            { name: "金融分期", icon: "icon-finance" }
          ]
        },
        {
          id: 4,
          name: "春风上海松江店",
          latitude: 31.032123,
          longitude: 121.226789,
          address: "上海市松江区xx路xx号",
          phone: "021-65432109",
          serviceName: "赵经理",
          servicePhone: "135xxxx3456",
          level: "B",
          hasFinance: false,
          canRegister: true,
          images: [
            "https://via.placeholder.com/600x400"
          ],
          services: [
            { name: "整车销售", icon: "icon-sale" },
            { name: "维修保养", icon: "icon-repair" },
            { name: "代客上牌", icon: "icon-register" }
          ]
        },
        {
          id: 5,
          name: "春风上海嘉定店",
          latitude: 31.382123,
          longitude: 121.266789,
          address: "上海市嘉定区xx路xx号",
          phone: "021-54321098",
          serviceName: "孙经理",
          servicePhone: "134xxxx7890",
          level: "C",
          hasFinance: false,
          canRegister: false,
          images: [
            "https://via.placeholder.com/600x400"
          ],
          services: [
            { name: "整车销售", icon: "icon-sale" },
            { name: "维修保养", icon: "icon-repair" }
          ]
        }
      ],
      searchKey: "",
      levels: ["A", "B", "C"],
      selectedLevel: "",
      services: [
        { label: "金融分期", value: "finance" },
        { label: "代客上牌", value: "register" },
        { label: "维修保养", value: "repair" },
        { label: "整车销售", value: "sale" }
      ],
      selectedServices: [],
      filteredStores: []
    };
  },
  onLoad() {
    this.initMarkers();
    this.getCurrentLocation();
  },
  methods: {
    // 初始化地图标记
    initMarkers() {
      this.markers = this.storeList.map((store) => ({
        id: store.id,
        latitude: store.latitude,
        longitude: store.longitude,
        width: 32,
        height: 32,
        callout: {
          content: store.name,
          color: "#333",
          fontSize: 12,
          borderRadius: 4,
          padding: 8,
          display: "ALWAYS"
        }
      }));
    },
    // 获取当前位置
    getCurrentLocation() {
      common_vendor.index.getLocation({
        type: "gcj02",
        success: (res) => {
          this.latitude = res.latitude;
          this.longitude = res.longitude;
        },
        fail: () => {
          common_vendor.index.showToast({
            title: "获取位置失败",
            icon: "none"
          });
        }
      });
    },
    // 点击标记
    handleMarkerTap(e) {
      const store = this.storeList.find((s) => s.id === e.markerId);
      if (store) {
        this.currentStore = store;
        this.showStoreDetail = true;
      }
    },
    // 关闭门店详情
    closeStoreDetail() {
      this.showStoreDetail = false;
      this.currentStore = null;
    },
    // 导航到门店
    navigate(store) {
      common_vendor.index.showActionSheet({
        itemList: ["腾讯地图", "高德地图", "百度地图", "苹果地图"],
        success: (res) => {
          switch (res.tapIndex) {
            case 0:
              this.openTencentMap(store);
              break;
            case 1:
              this.openAMap(store);
              break;
            case 2:
              this.openBaiduMap(store);
              break;
            case 3:
              this.openAppleMap(store);
              break;
          }
        }
      });
    },
    // 打开腾讯地图
    openTencentMap(store) {
      const url = `qqmap://map/geocoder?coord=${store.latitude},${store.longitude}&referer=你很机车`;
      plus.runtime.openURL(url, (err) => {
        if (err) {
          common_vendor.index.showModal({
            title: "提示",
            content: "您尚未安装腾讯地图，是否前往下载？",
            success: (res) => {
              if (res.confirm) {
                plus.runtime.openURL("https://map.qq.com/mobile/");
              }
            }
          });
        }
      });
    },
    // 打开高德地图
    openAMap(store) {
      const url = `androidamap://navi?sourceApplication=你很机车&lat=${store.latitude}&lon=${store.longitude}&dev=0&style=2`;
      plus.runtime.openURL(url, (err) => {
        if (err) {
          common_vendor.index.showModal({
            title: "提示",
            content: "您尚未安装高德地图，是否前往下载？",
            success: (res) => {
              if (res.confirm) {
                plus.runtime.openURL("https://mobile.amap.com/");
              }
            }
          });
        }
      });
    },
    // 打开百度地图
    openBaiduMap(store) {
      const url = `baidumap://map/direction?destination=${store.latitude},${store.longitude}&coord_type=gcj02&mode=driving&src=你很机车`;
      plus.runtime.openURL(url, (err) => {
        if (err) {
          common_vendor.index.showModal({
            title: "提示",
            content: "您尚未安装百度地图，是否前往下载？",
            success: (res) => {
              if (res.confirm) {
                plus.runtime.openURL("https://map.baidu.com/zt/client/index/");
              }
            }
          });
        }
      });
    },
    // 打开苹果地图(仅iOS)
    openAppleMap(store) {
      const url = `http://maps.apple.com/?ll=${store.latitude},${store.longitude}&q=${encodeURIComponent(store.name)}`;
      if (common_vendor.index.getSystemInfoSync().platform === "ios") {
        plus.runtime.openURL(url);
      } else {
        common_vendor.index.showToast({
          title: "仅支持iOS设备",
          icon: "none"
        });
      }
    },
    // 拨打电话
    makeCall(phone) {
      common_vendor.index.makePhoneCall({
        phoneNumber: phone,
        fail: () => {
          common_vendor.index.showToast({
            title: "拨打失败",
            icon: "none"
          });
        }
      });
    },
    handleSearch() {
      this.filterStores();
    },
    showFilter() {
      this.$refs.filterPopup.open();
    },
    closeFilter() {
      this.$refs.filterPopup.close();
    },
    selectLevel(level) {
      this.selectedLevel = this.selectedLevel === level ? "" : level;
      this.filterStores();
    },
    toggleService(service) {
      const index = this.selectedServices.indexOf(service);
      if (index > -1) {
        this.selectedServices.splice(index, 1);
      } else {
        this.selectedServices.push(service);
      }
      this.filterStores();
    },
    resetFilter() {
      this.selectedLevel = "";
      this.selectedServices = [];
      this.filterStores();
      this.closeFilter();
    },
    confirmFilter() {
      this.filterStores();
      this.closeFilter();
    },
    filterStores() {
      let result = [...this.storeList];
      if (this.searchKey.trim()) {
        const key = this.searchKey.toLowerCase().trim();
        result = result.filter(
          (store) => store.name.toLowerCase().includes(key) || store.address.toLowerCase().includes(key)
        );
      }
      if (this.selectedLevel) {
        result = result.filter((store) => store.level === this.selectedLevel);
      }
      if (this.selectedServices.length) {
        result = result.filter((store) => {
          return this.selectedServices.every((service) => {
            switch (service) {
              case "finance":
                return store.hasFinance;
              case "register":
                return store.canRegister;
              case "repair":
                return store.services.some((s) => s.name === "维修保养");
              case "sale":
                return store.services.some((s) => s.name === "整车销售");
              default:
                return true;
            }
          });
        });
      }
      this.filteredStores = result;
      this.updateMarkers();
    },
    updateMarkers() {
      this.markers = this.filteredStores.map((store) => ({
        id: store.id,
        latitude: store.latitude,
        longitude: store.longitude,
        width: 32,
        height: 32,
        callout: {
          content: store.name,
          color: "#333",
          fontSize: 12,
          borderRadius: 4,
          padding: 8,
          display: "ALWAYS"
        }
      }));
    }
  }
};
if (!Array) {
  const _component_uni_popup = common_vendor.resolveComponent("uni-popup");
  _component_uni_popup();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o((...args) => $options.handleSearch && $options.handleSearch(...args)),
    b: $data.searchKey,
    c: common_vendor.o(($event) => $data.searchKey = $event.detail.value),
    d: common_vendor.o((...args) => $options.showFilter && $options.showFilter(...args)),
    e: common_vendor.o((...args) => $options.closeFilter && $options.closeFilter(...args)),
    f: common_vendor.f($data.levels, (level, k0, i0) => {
      return {
        a: common_vendor.t(level),
        b: level,
        c: $data.selectedLevel === level ? 1 : "",
        d: common_vendor.o(($event) => $options.selectLevel(level), level)
      };
    }),
    g: common_vendor.f($data.services, (service, index, i0) => {
      return {
        a: common_vendor.t(service.label),
        b: index,
        c: $data.selectedServices.includes(service.value) ? 1 : "",
        d: common_vendor.o(($event) => $options.toggleService(service.value), index)
      };
    }),
    h: common_vendor.o((...args) => $options.resetFilter && $options.resetFilter(...args)),
    i: common_vendor.o((...args) => $options.confirmFilter && $options.confirmFilter(...args)),
    j: common_vendor.sr("filterPopup", "51b1b5bf-0"),
    k: common_vendor.p({
      type: "bottom"
    }),
    l: $data.latitude,
    m: $data.longitude,
    n: $data.markers,
    o: common_vendor.o((...args) => $options.handleMarkerTap && $options.handleMarkerTap(...args)),
    p: $data.showStoreDetail
  }, $data.showStoreDetail ? common_vendor.e({
    q: common_vendor.t($data.currentStore.name),
    r: common_vendor.t($data.currentStore.level),
    s: $data.currentStore.hasFinance
  }, $data.currentStore.hasFinance ? {} : {}, {
    t: $data.currentStore.canRegister
  }, $data.currentStore.canRegister ? {} : {}, {
    v: common_vendor.o((...args) => $options.closeStoreDetail && $options.closeStoreDetail(...args)),
    w: common_vendor.f($data.currentStore.images, (img, index, i0) => {
      return {
        a: img,
        b: index
      };
    }),
    x: $data.currentStore.images.length > 1,
    y: common_vendor.t($data.currentStore.address),
    z: common_vendor.o(($event) => $options.navigate($data.currentStore)),
    A: common_vendor.t($data.currentStore.phone),
    B: common_vendor.o(($event) => $options.makeCall($data.currentStore.phone)),
    C: common_vendor.t($data.currentStore.serviceName),
    D: common_vendor.o(($event) => $options.makeCall($data.currentStore.servicePhone)),
    E: common_vendor.f($data.currentStore.services, (service, index, i0) => {
      return {
        a: common_vendor.n(service.icon),
        b: common_vendor.t(service.name),
        c: index
      };
    })
  }) : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-51b1b5bf"]]);
wx.createPage(MiniProgramPage);
