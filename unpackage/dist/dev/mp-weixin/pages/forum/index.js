"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      searchKey: "",
      currentSort: 0,
      sortOptions: [
        { name: "最新", key: "time" },
        { name: "热度", key: "likes", sortable: true }
      ],
      originalPosts: [],
      postList: [],
      page: 1,
      isLoading: false,
      isRefreshing: false,
      noMore: false,
      defaultAvatar: "https://via.placeholder.com/80x80",
      defaultImage: "https://via.placeholder.com/300x200",
      likeAnimations: {}
    };
  },
  onLoad() {
    this.initData();
  },
  methods: {
    // 初始化数据
    initData() {
      const initialPosts = [
        {
          id: 1,
          username: "测试用户1",
          avatar: "https://via.placeholder.com/80x80",
          time: "2024-01-20 12:00",
          title: "春风NK400使用体验分享",
          content: "最近入手了一台春风NK400，来分享一下使用体验。整车动力充沛，制动性能出色...",
          images: [
            "https://via.placeholder.com/300x200",
            "https://via.placeholder.com/300x200"
          ],
          likes: 120,
          comments: 36,
          isLiked: false,
          isFollowed: false
        },
        {
          id: 2,
          username: "多图片测试2",
          avatar: "https://via.placeholder.com/80x80",
          time: "2024-01-20 11:30",
          title: "周末骑行路线推荐",
          content: "分享一条适合周末骑行的路线，风景优美，路况良好...",
          images: [
            "https://via.placeholder.com/300x200",
            "https://via.placeholder.com/300x200",
            "https://via.placeholder.com/300x200",
            "https://via.placeholder.com/300x200",
            "https://via.placeholder.com/300x200"
          ],
          likes: 88,
          comments: 25,
          isLiked: false,
          isFollowed: false
        }
      ];
      this.originalPosts = [...initialPosts];
      this.postList = [...initialPosts];
      this.loadPosts();
    },
    // 加载帖子数据
    async loadPosts(type = "more") {
      if (this.isLoading || type === "more" && this.noMore)
        return;
      this.isLoading = true;
      try {
        const newPosts = Array(5).fill({}).map((_, index) => ({
          id: this.postList.length + index + 1,
          username: `用户${Math.floor(Math.random() * 1e3)}`,
          avatar: "https://via.placeholder.com/80x80",
          time: (/* @__PURE__ */ new Date()).toLocaleString(),
          title: `测试帖子标题 ${this.postList.length + index + 1}`,
          content: "这是帖子内容，描述了一些有趣的事情...",
          images: [
            "https://via.placeholder.com/300x200",
            "https://via.placeholder.com/300x200",
            "https://via.placeholder.com/300x200",
            "https://via.placeholder.com/300x200",
            "https://via.placeholder.com/300x200",
            "https://via.placeholder.com/300x200",
            "https://via.placeholder.com/300x200",
            "https://via.placeholder.com/300x200",
            "https://via.placeholder.com/300x200"
          ].slice(0, Math.floor(Math.random() * 9) + 1),
          likes: Math.floor(Math.random() * 100),
          comments: Math.floor(Math.random() * 30),
          isLiked: false,
          isFollowed: false
        }));
        this.initLikeStatus(newPosts);
        let updatedPosts = [];
        if (type === "refresh") {
          updatedPosts = newPosts;
          this.originalPosts = [...newPosts];
          this.page = 1;
          this.noMore = false;
        } else {
          updatedPosts = [...this.postList, ...newPosts];
          this.originalPosts = [...this.originalPosts, ...newPosts];
          this.page++;
        }
        this.applySort(updatedPosts);
        this.postList = updatedPosts;
        if (this.page >= 3) {
          this.noMore = true;
        }
      } catch (error) {
        console.error("加载失败:", error);
        common_vendor.index.showToast({
          title: "加载失败",
          icon: "none"
        });
      } finally {
        this.isLoading = false;
        if (type === "refresh") {
          this.isRefreshing = false;
        }
      }
    },
    // 抽取排序逻辑为单独的方法
    applySort(posts) {
      switch (this.sortOptions[this.currentSort].key) {
        case "time":
          posts.sort((a, b) => new Date(b.time) - new Date(a.time));
          break;
        case "likes":
          posts.sort((a, b) => b.likes - a.likes);
          break;
      }
      return posts;
    },
    // 跳转到帖子详情
    goToDetail(id) {
      common_vendor.index.navigateTo({
        url: `/pages/forum/detail?id=${id}`,
        fail: (err) => {
          console.error("跳转失败:", err);
          common_vendor.index.showToast({
            title: "页面跳转失败",
            icon: "none"
          });
        }
      });
    },
    // 处理关注
    handleFollow(post) {
      post.isFollowed = !post.isFollowed;
      common_vendor.index.showToast({
        title: post.isFollowed ? "已关注" : "已取消关注",
        icon: "success"
      });
    },
    // 处理点赞
    handleLike(post) {
      if (this.likeAnimations[post.id])
        return;
      post.isLiked = !post.isLiked;
      post.likes += post.isLiked ? 1 : -1;
      this.$set(this.likeAnimations, post.id, true);
      setTimeout(() => {
        this.$set(this.likeAnimations, post.id, false);
      }, 300);
      try {
        const likedPosts = common_vendor.index.getStorageSync("likedPosts") || {};
        if (post.isLiked) {
          likedPosts[post.id] = true;
        } else {
          delete likedPosts[post.id];
        }
        common_vendor.index.setStorageSync("likedPosts", likedPosts);
      } catch (e) {
        console.error("保存点赞状态失败:", e);
      }
      common_vendor.index.showToast({
        title: post.isLiked ? "已点赞" : "已取消点赞",
        icon: "none",
        duration: 1e3
      });
    },
    // 处理分享
    handleShare(post) {
      common_vendor.index.showActionSheet({
        itemList: ["分享给好友", "复制链接"],
        success: (res) => {
          if (res.tapIndex === 0) {
            common_vendor.index.showToast({
              title: "分享成功",
              icon: "success"
            });
          } else {
            common_vendor.index.setClipboardData({
              data: `https://example.com/post/${post.id}`,
              success: () => {
                common_vendor.index.showToast({
                  title: "链接已复制",
                  icon: "success"
                });
              }
            });
          }
        }
      });
    },
    // 创建新帖子
    createPost() {
      common_vendor.index.navigateTo({
        url: "/pages/forum/create"
      });
    },
    // 切换排序方式
    switchSort(index) {
      if (this.currentSort === index)
        return;
      this.currentSort = index;
      const sortedPosts = [...this.originalPosts];
      this.postList = this.applySort(sortedPosts);
      common_vendor.index.showToast({
        title: `按${this.sortOptions[index].name}排序`,
        icon: "none",
        duration: 1500
      });
    },
    // 下拉刷
    async onRefresh() {
      this.isRefreshing = true;
      await this.loadPosts("refresh");
    },
    // 上拉加载更多
    onLoadMore() {
      if (!this.isLoading && !this.noMore) {
        this.loadPosts("more");
      }
    },
    // 搜索帖子
    handleSearch() {
      if (!this.searchKey.trim())
        return;
      this.page = 1;
      this.noMore = false;
      const searchResult = this.postList.filter(
        (post) => post.title.includes(this.searchKey) || post.content.includes(this.searchKey)
      );
      this.postList = searchResult;
      if (searchResult.length === 0) {
        this.noMore = true;
        common_vendor.index.showToast({
          title: "没有找到相关内容",
          icon: "none"
        });
      }
    },
    // 在加载帖子时恢复点赞状态
    initLikeStatus(posts) {
      try {
        const likedPosts = common_vendor.index.getStorageSync("likedPosts") || {};
        posts.forEach((post) => {
          if (likedPosts[post.id]) {
            post.isLiked = true;
          }
        });
      } catch (e) {
        console.error("恢复点赞状态失败:", e);
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o((...args) => $options.handleSearch && $options.handleSearch(...args)),
    b: $data.searchKey,
    c: common_vendor.o(($event) => $data.searchKey = $event.detail.value),
    d: common_vendor.f($data.sortOptions, (item, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(item.name),
        b: item.sortable
      }, item.sortable ? {} : {}, {
        c: index,
        d: $data.currentSort === index ? 1 : "",
        e: common_vendor.o(($event) => $options.switchSort(index), index)
      });
    }),
    e: common_vendor.f($data.postList, (post, index, i0) => {
      return common_vendor.e({
        a: post.avatar,
        b: common_vendor.t(post.username),
        c: common_vendor.t(post.time),
        d: common_vendor.t(post.isFollowed ? "已关注" : "关注"),
        e: post.isFollowed ? 1 : "",
        f: common_vendor.o(($event) => $options.handleFollow(post), post.id),
        g: common_vendor.t(post.title),
        h: common_vendor.t(post.content),
        i: post.images && post.images.length
      }, post.images && post.images.length ? {
        j: common_vendor.f(post.images.slice(0, 3), (img, imgIndex, i1) => {
          return common_vendor.e({
            a: img,
            b: imgIndex === 2 && post.images.length > 3
          }, imgIndex === 2 && post.images.length > 3 ? {
            c: common_vendor.t(post.images.length - 3)
          } : {}, {
            d: imgIndex,
            e: common_vendor.o(($event) => _ctx.previewImage(post.images, imgIndex), imgIndex)
          });
        })
      } : {}, {
        k: common_vendor.n(post.isLiked ? "icon-like-fill" : "icon-like"),
        l: common_vendor.t(post.likes),
        m: post.isLiked ? 1 : "",
        n: $data.likeAnimations[post.id] ? 1 : "",
        o: common_vendor.o(($event) => $options.handleLike(post), post.id),
        p: common_vendor.t(post.comments),
        q: common_vendor.o(($event) => $options.handleShare(post), post.id),
        r: post.id,
        s: common_vendor.o(($event) => $options.goToDetail(post.id), post.id)
      });
    }),
    f: $data.isLoading
  }, $data.isLoading ? {} : {}, {
    g: $data.noMore
  }, $data.noMore ? {} : {}, {
    h: $data.isRefreshing,
    i: common_vendor.o((...args) => $options.onRefresh && $options.onRefresh(...args)),
    j: common_vendor.o((...args) => $options.onLoadMore && $options.onLoadMore(...args)),
    k: common_vendor.o((...args) => $options.createPost && $options.createPost(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-0e21892e"]]);
wx.createPage(MiniProgramPage);
