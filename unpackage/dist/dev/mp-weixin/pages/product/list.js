"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      currentCategory: 0,
      currentSubCategory: "",
      selectedProduct: null,
      categories: [
        { name: "车型系列", type: "series" },
        { name: "机车配件", type: "parts" }
      ],
      seriesList: [
        { name: "NK系列", description: "都市运动街车，为城市而生" },
        { name: "GT系列", description: "舒适旅行，自由远行" },
        { name: "MT系列", description: "探索无限可能" },
        { name: "SR系列", description: "竞速精神，运动基因" },
        { name: "CU系列", description: "都市运动街车，为城市而生" }
      ],
      partsList: [
        { name: "保养件", description: "原厂正品配件，品质保障" },
        { name: "制动系统", description: "确保安全的核心部件" },
        { name: "传动系统", description: "动力传递的关键部件" }
      ],
      products: {
        "NK系列": [
          { id: 1, name: "NK400", price: "68800", type: "series" },
          { id: 2, name: "NK300", price: "52800", type: "series" }
        ],
        "GT系列": [
          { id: 3, name: "650GT", price: "75800", type: "series" },
          { id: 4, name: "400GT", price: "65800", type: "series" }
        ],
        "保养件": [
          { id: 11, name: "机油", price: "288", type: "parts" },
          { id: 12, name: "机油滤芯", price: "68", type: "parts" }
        ],
        "制动系统": [
          { id: 13, name: "刹车片", price: "328", type: "parts" }
        ],
        "传动系统": [
          { id: 14, name: "链条", price: "468", type: "parts" }
        ]
      }
    };
  },
  computed: {
    currentSubCategories() {
      return this.categories[this.currentCategory].type === "series" ? this.seriesList : this.partsList;
    },
    showSubCategories() {
      return true;
    },
    currentCategoryInfo() {
      var _a;
      const subCategory = this.currentSubCategory || this.currentSubCategories[0].name;
      return {
        name: subCategory,
        description: (_a = this.currentSubCategories.find((item) => item.name === subCategory)) == null ? void 0 : _a.description
      };
    },
    currentProducts() {
      const subCategory = this.currentSubCategory || this.currentSubCategories[0].name;
      return this.products[subCategory] || [];
    },
    groupedProducts() {
      const products = this.currentProducts;
      const groups = [];
      for (let i = 0; i < products.length; i += 2) {
        groups.push(products.slice(i, i + 2));
      }
      return groups;
    }
  },
  created() {
    this.selectedProduct = this.products["NK系列"][0];
  },
  methods: {
    switchCategory(index) {
      this.currentCategory = index;
      this.currentSubCategory = this.currentSubCategories[0].name;
      this.updateSelectedProduct();
    },
    switchSubCategory(category) {
      this.currentSubCategory = category;
      this.updateSelectedProduct();
    },
    updateSelectedProduct() {
      const products = this.currentProducts;
      if (products.length > 0) {
        this.selectedProduct = products[0];
      }
    },
    selectProduct(product) {
      this.selectedProduct = product;
    },
    goToDetail(id) {
      common_vendor.index.navigateTo({
        url: `/pages/product/detail?id=${id}`
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.f($data.categories, (item, index, i0) => {
      return {
        a: common_vendor.t(item.name),
        b: index,
        c: $data.currentCategory === index ? 1 : "",
        d: common_vendor.o(($event) => $options.switchCategory(index), index)
      };
    }),
    b: $options.showSubCategories
  }, $options.showSubCategories ? {
    c: common_vendor.f($options.currentSubCategories, (item, index, i0) => {
      return {
        a: common_vendor.t(item.name),
        b: index,
        c: $data.currentSubCategory === item.name ? 1 : "",
        d: common_vendor.o(($event) => $options.switchSubCategory(item.name), index)
      };
    })
  } : {}, {
    d: common_vendor.t($data.selectedProduct.name),
    e: common_vendor.t($options.currentCategoryInfo.name),
    f: common_vendor.t($options.currentCategoryInfo.description),
    g: common_vendor.t($data.selectedProduct.price),
    h: common_vendor.o(($event) => $options.goToDetail($data.selectedProduct.id)),
    i: common_vendor.f($options.groupedProducts, (group, groupIndex, i0) => {
      return {
        a: common_vendor.f(group, (product, index, i1) => {
          return {
            a: common_vendor.t(product.name),
            b: common_vendor.t(product.price),
            c: common_vendor.t(product.category),
            d: index,
            e: common_vendor.o(($event) => $options.selectProduct(product), index),
            f: $data.selectedProduct.id === product.id ? 1 : ""
          };
        }),
        b: groupIndex
      };
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-e958a167"]]);
wx.createPage(MiniProgramPage);
