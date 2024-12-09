"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      postId: "",
      commentText: "",
      postDetail: {
        username: "用户名",
        avatar: "https://via.placeholder.com/80x80",
        time: "2024-01-20 12:00",
        title: "帖子标题",
        content: "这是帖子详细内容...",
        images: ["https://via.placeholder.com/300x200"],
        likes: 128,
        comments: 36,
        isLiked: false,
        isFollowed: false
      },
      commentList: [
        {
          username: "评论用户1",
          userId: "456",
          avatar: "https://via.placeholder.com/80x80",
          time: "10分钟前",
          content: "这是一条评论内容",
          likes: 12,
          isLiked: false,
          isDisliked: false,
          replies: [
            {
              username: "回复用户1",
              userId: "123",
              content: "这是一条回复内容",
              time: "8分钟前",
              likes: 3,
              isLiked: false,
              isDisliked: false
            }
          ]
        },
        {
          username: "评论用户2",
          userId: "789",
          avatar: "https://via.placeholder.com/80x80",
          time: "15分钟前",
          content: "非常棒的分享！",
          likes: 8,
          isLiked: false,
          isDisliked: false,
          replies: []
        },
        {
          username: "评论用户3",
          userId: "101",
          avatar: "https://via.placeholder.com/80x80",
          time: "20分钟前",
          content: "期待更多内容",
          likes: 5,
          isLiked: false,
          isDisliked: false,
          replies: [
            {
              username: "回复用户2",
              userId: "102",
              content: "我也是",
              time: "18分钟前",
              likes: 2,
              isLiked: false,
              isDisliked: false
            },
            {
              username: "回复用户3",
              userId: "103",
              content: "+1",
              time: "15分钟前",
              likes: 1,
              isLiked: false,
              isDisliked: false
            }
          ]
        }
      ],
      replyText: "",
      likeAnimation: false,
      showEmoji: false,
      emojiList: [],
      currentUserId: "123"
    };
  },
  onLoad(options) {
    this.postId = options.id;
    try {
      const pages = getCurrentPages();
      const prevPage = pages[pages.length - 2];
      if (prevPage && prevPage.$vm.postList) {
        const post = prevPage.$vm.postList.find((p) => p.id == this.postId);
        if (post) {
          this.postDetail = {
            username: post.username,
            avatar: post.avatar,
            time: post.time,
            title: post.title,
            content: post.content,
            images: post.images || [],
            likes: post.likes,
            comments: post.comments,
            isLiked: post.isLiked,
            isFollowed: post.isFollowed
          };
        }
      }
    } catch (e) {
      console.error("获取帖子详情失败:", e);
    }
  },
  methods: {
    handleFollow() {
      this.postDetail.isFollowed = !this.postDetail.isFollowed;
      try {
        const pages = getCurrentPages();
        const prevPage = pages[pages.length - 2];
        if (prevPage && prevPage.$vm.postList) {
          const post = prevPage.$vm.postList.find((p) => p.id == this.postId);
          if (post) {
            post.isFollowed = this.postDetail.isFollowed;
          }
        }
      } catch (e) {
        console.error("同步关注状态失败:", e);
      }
      common_vendor.index.showToast({
        title: this.postDetail.isFollowed ? "已关注" : "已取消关注",
        icon: "success"
      });
    },
    handleLike() {
      this.postDetail.isLiked = !this.postDetail.isLiked;
      this.postDetail.likes += this.postDetail.isLiked ? 1 : -1;
      try {
        const pages = getCurrentPages();
        const prevPage = pages[pages.length - 2];
        if (prevPage && prevPage.$vm.postList) {
          const post = prevPage.$vm.postList.find((p) => p.id == this.postId);
          if (post) {
            post.isLiked = this.postDetail.isLiked;
            post.likes = this.postDetail.likes;
          }
        }
        const likedPosts = common_vendor.index.getStorageSync("likedPosts") || {};
        if (this.postDetail.isLiked) {
          likedPosts[this.postId] = true;
        } else {
          delete likedPosts[this.postId];
        }
        common_vendor.index.setStorageSync("likedPosts", likedPosts);
      } catch (e) {
        console.error("同步点赞状态失败:", e);
      }
    },
    handleShare() {
      common_vendor.index.showActionSheet({
        itemList: ["分享到朋友圈", "分享给好友", "复制链接"],
        success: (res) => {
          switch (res.tapIndex) {
            case 0:
              this.shareToTimeline();
              break;
            case 1:
              this.shareToFriend();
              break;
            case 2:
              this.copyLink();
              break;
          }
        }
      });
    },
    shareToTimeline() {
      common_vendor.index.showToast({
        title: "分享到朋友圈",
        icon: "none"
      });
    },
    shareToFriend() {
      common_vendor.index.showToast({
        title: "分享给好友",
        icon: "none"
      });
    },
    copyLink() {
      common_vendor.index.setClipboardData({
        data: `https://example.com/post/${this.postId}`,
        success: () => {
          common_vendor.index.showToast({
            title: "链接已复制",
            icon: "success"
          });
        }
      });
    },
    previewImage(index) {
      const currentImage = this.postDetail.images[index];
      common_vendor.index.previewImage({
        current: currentImage,
        urls: this.postDetail.images,
        indicator: "number",
        loop: true,
        success: () => {
          console.log("预览成功");
        },
        fail: () => {
          common_vendor.index.showToast({
            title: "预览失败",
            icon: "none"
          });
        }
      });
    },
    submitComment() {
      if (!this.commentText.trim())
        return;
      const newComment = {
        username: "当前用户",
        userId: this.currentUserId,
        avatar: "https://via.placeholder.com/80x80",
        time: "刚刚",
        content: this.commentText,
        likes: 0,
        isLiked: false,
        isDisliked: false,
        replies: []
      };
      this.commentList.unshift(newComment);
      this.postDetail.comments++;
      this.commentText = "";
      try {
        const pages = getCurrentPages();
        const prevPage = pages[pages.length - 2];
        if (prevPage && prevPage.$vm.postList) {
          const post = prevPage.$vm.postList.find((p) => p.id == this.postId);
          if (post) {
            post.comments = this.postDetail.comments;
          }
        }
      } catch (e) {
        console.error("同步评论数失败:", e);
      }
      common_vendor.index.showToast({
        title: "评论成功",
        icon: "success"
      });
    },
    // 评论点赞
    handleCommentLike(comment) {
      if (!comment.likes)
        comment.likes = 0;
      comment.isLiked = !comment.isLiked;
      comment.likes += comment.isLiked ? 1 : -1;
      this.$set(comment, "likeAnimation", true);
      setTimeout(() => {
        this.$set(comment, "likeAnimation", false);
      }, 300);
    },
    // 显示回复输入框
    showReplyInput(comment) {
      this.commentList.forEach((item) => {
        this.$set(item, "showReplyInput", false);
      });
      this.$set(comment, "showReplyInput", true);
      this.replyText = "";
    },
    // 隐藏回复输入框
    hideReplyInput(comment) {
      this.$set(comment, "showReplyInput", false);
      this.replyText = "";
    },
    // 提交回复
    submitReply(comment) {
      if (!this.replyText.trim()) {
        common_vendor.index.showToast({
          title: "请输入回复内容",
          icon: "none"
        });
        return;
      }
      if (!comment.replies) {
        this.$set(comment, "replies", []);
      }
      const reply = {
        username: "当前用户",
        userId: this.currentUserId,
        content: this.replyText,
        time: "刚刚",
        likes: 0,
        isLiked: false,
        isDisliked: false
      };
      comment.replies.push(reply);
      this.hideReplyInput(comment);
      common_vendor.index.showToast({
        title: "回复成功",
        icon: "success"
      });
    },
    // 显示评论操作菜单
    showCommentOptions(comment) {
      common_vendor.index.showActionSheet({
        itemList: ["删除", "举报"],
        success: (res) => {
          switch (res.tapIndex) {
            case 0:
              this.deleteComment(comment);
              break;
            case 1:
              this.reportComment(comment);
              break;
          }
        }
      });
    },
    // 删除评论
    deleteComment(comment) {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要删除这条评论吗？",
        success: (res) => {
          if (res.confirm) {
            const index = this.commentList.indexOf(comment);
            if (index > -1) {
              this.commentList.splice(index, 1);
              this.postDetail.comments--;
              common_vendor.index.showToast({
                title: "删除成功",
                icon: "success"
              });
            }
          }
        }
      });
    },
    // 举报评论
    reportComment(comment) {
      common_vendor.index.showActionSheet({
        itemList: ["垃圾广告", "违法违规", "色情低俗", "攻击谩骂", "其他"],
        success: (res) => {
          common_vendor.index.showToast({
            title: "举报成功",
            icon: "success"
          });
        }
      });
    },
    // 切换表情面板
    toggleEmojiPanel() {
      this.showEmoji = !this.showEmoji;
    },
    // 插入表情
    insertEmoji(emoji) {
      this.commentText += emoji;
    },
    isCurrentUser(comment) {
      return comment.userId === this.currentUserId;
    },
    handleCommentOperation(comment) {
      if (this.isCurrentUser(comment)) {
        this.deleteComment(comment);
      } else {
        this.reportComment(comment);
      }
    },
    handleCommentDislike(comment) {
      if (comment.isDisliked) {
        comment.isDisliked = false;
      } else {
        comment.isDisliked = true;
        if (comment.isLiked) {
          comment.isLiked = false;
          comment.likes--;
        }
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.postDetail.avatar,
    b: common_vendor.t($data.postDetail.username),
    c: common_vendor.t($data.postDetail.time),
    d: common_vendor.t($data.postDetail.isFollowed ? "已关注" : "关注"),
    e: common_vendor.o((...args) => $options.handleFollow && $options.handleFollow(...args)),
    f: common_vendor.t($data.postDetail.title),
    g: common_vendor.t($data.postDetail.content),
    h: $data.postDetail.images && $data.postDetail.images.length
  }, $data.postDetail.images && $data.postDetail.images.length ? {
    i: common_vendor.f($data.postDetail.images, (img, index, i0) => {
      return {
        a: index,
        b: img,
        c: common_vendor.o(($event) => $options.previewImage(index), index)
      };
    })
  } : {}, {
    j: common_vendor.n($data.postDetail.isLiked ? "icon-like-fill" : "icon-like"),
    k: common_vendor.t($data.postDetail.likes),
    l: common_vendor.o((...args) => $options.handleLike && $options.handleLike(...args)),
    m: common_vendor.t($data.postDetail.comments),
    n: common_vendor.o((...args) => $options.handleShare && $options.handleShare(...args)),
    o: common_vendor.t($data.postDetail.comments),
    p: common_vendor.f($data.commentList, (comment, index, i0) => {
      return common_vendor.e({
        a: comment.avatar,
        b: common_vendor.t(comment.username),
        c: common_vendor.t(comment.content),
        d: common_vendor.t(comment.time),
        e: common_vendor.o(($event) => $options.showReplyInput(comment), index),
        f: comment.showReplyInput
      }, comment.showReplyInput ? {
        g: "回复 " + comment.username,
        h: common_vendor.o(($event) => $options.submitReply(comment), index),
        i: $data.replyText,
        j: common_vendor.o(($event) => $data.replyText = $event.detail.value, index),
        k: common_vendor.o(($event) => $options.hideReplyInput(comment), index),
        l: common_vendor.o(($event) => $options.submitReply(comment), index)
      } : {}, {
        m: comment.replies && comment.replies.length
      }, comment.replies && comment.replies.length ? {
        n: common_vendor.f(comment.replies, (reply, replyIndex, i1) => {
          return {
            a: common_vendor.t(reply.username),
            b: common_vendor.t(reply.content),
            c: replyIndex
          };
        })
      } : {}, {
        o: common_vendor.t($options.isCurrentUser(comment) ? "删除" : "举报"),
        p: common_vendor.o(($event) => $options.handleCommentOperation(comment), index),
        q: common_vendor.n(comment.isLiked ? "icon-like-fill" : "icon-like"),
        r: common_vendor.t(comment.likes || 0),
        s: common_vendor.o(($event) => $options.handleCommentLike(comment), index),
        t: common_vendor.n(comment.isDisliked ? "icon-dislike-fill" : "icon-dislike"),
        v: common_vendor.o(($event) => $options.handleCommentDislike(comment), index),
        w: index
      });
    }),
    q: common_vendor.o((...args) => $options.toggleEmojiPanel && $options.toggleEmojiPanel(...args)),
    r: common_vendor.o((...args) => $options.submitComment && $options.submitComment(...args)),
    s: $data.commentText,
    t: common_vendor.o(($event) => $data.commentText = $event.detail.value),
    v: common_vendor.o((...args) => $options.submitComment && $options.submitComment(...args)),
    w: $data.showEmoji
  }, $data.showEmoji ? {
    x: common_vendor.f($data.emojiList, (emoji, index, i0) => {
      return {
        a: common_vendor.t(emoji),
        b: index,
        c: common_vendor.o(($event) => $options.insertEmoji(emoji), index)
      };
    })
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-15db4200"]]);
wx.createPage(MiniProgramPage);
