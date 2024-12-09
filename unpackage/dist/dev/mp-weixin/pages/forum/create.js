"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      postForm: {
        title: "",
        content: "",
        images: []
      }
    };
  },
  computed: {
    canPublish() {
      return this.postForm.title.trim() && this.postForm.content.trim();
    }
  },
  methods: {
    handleCancel() {
      if (this.postForm.title || this.postForm.content || this.postForm.images.length) {
        common_vendor.index.showModal({
          title: "提示",
          content: "是否放弃编辑？",
          success: (res) => {
            if (res.confirm) {
              common_vendor.index.navigateBack();
            }
          }
        });
      } else {
        common_vendor.index.navigateBack();
      }
    },
    // 选择图片
    chooseImage() {
      common_vendor.index.chooseImage({
        count: 9 - this.postForm.images.length,
        sizeType: ["compressed"],
        sourceType: ["album", "camera"],
        success: (res) => {
          this.postForm.images = [...this.postForm.images, ...res.tempFilePaths];
        },
        fail: () => {
          common_vendor.index.showToast({
            title: "选择图片失败",
            icon: "none"
          });
        }
      });
    },
    // 删除图片
    deleteImage(index) {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要删除这张图片吗？",
        success: (res) => {
          if (res.confirm) {
            this.postForm.images.splice(index, 1);
          }
        }
      });
    },
    // 发布帖子
    handlePublish() {
      if (!this.canPublish)
        return;
      const newPost = {
        id: Date.now(),
        username: "当前用户",
        avatar: "https://via.placeholder.com/300x200",
        time: (/* @__PURE__ */ new Date()).toLocaleString(),
        title: this.postForm.title,
        content: this.postForm.content,
        images: this.postForm.images,
        likes: 0,
        comments: 0,
        isLiked: false,
        isFollowed: false
      };
      try {
        const pages = getCurrentPages();
        const prevPage = pages[pages.length - 2];
        if (prevPage && prevPage.$vm.postList) {
          prevPage.$vm.postList.unshift(newPost);
          prevPage.$vm.originalPosts.unshift(newPost);
        }
        common_vendor.index.showToast({
          title: "发布成功",
          icon: "success"
        });
        setTimeout(() => {
          common_vendor.index.navigateBack();
        }, 1500);
      } catch (e) {
        console.error("同步帖子数据失败:", e);
        common_vendor.index.showToast({
          title: "发布失败",
          icon: "none"
        });
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o((...args) => $options.handleCancel && $options.handleCancel(...args)),
    b: !$options.canPublish ? 1 : "",
    c: common_vendor.o((...args) => $options.handlePublish && $options.handlePublish(...args)),
    d: $data.postForm.title,
    e: common_vendor.o(($event) => $data.postForm.title = $event.detail.value),
    f: $data.postForm.content,
    g: common_vendor.o(($event) => $data.postForm.content = $event.detail.value),
    h: common_vendor.f($data.postForm.images, (img, index, i0) => {
      return {
        a: img,
        b: common_vendor.o(($event) => $options.deleteImage(index), index),
        c: index
      };
    }),
    i: $data.postForm.images.length < 9
  }, $data.postForm.images.length < 9 ? {
    j: common_vendor.t($data.postForm.images.length),
    k: common_vendor.o((...args) => $options.chooseImage && $options.chooseImage(...args))
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-ee120cef"]]);
wx.createPage(MiniProgramPage);
