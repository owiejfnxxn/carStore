<template>
  <view class="detail-container">
    <!-- 帖子内容 -->
    <scroll-view class="content-scroll" scroll-y>
      <view class="post-content">
        <!-- 用户信息 -->
        <view class="user-info">
          <image class="avatar" :src="postDetail.avatar" mode="aspectFill"/>
          <view class="info">
            <text class="username">{{postDetail.username}}</text>
            <text class="time">{{postDetail.time}}</text>
          </view>
          <button class="follow-btn" @tap="handleFollow">
            {{postDetail.isFollowed ? '已关注' : '关注'}}
          </button>
        </view>
        
        <!-- 帖子内容 -->
        <view class="post-body">
          <text class="title">{{postDetail.title}}</text>
          <text class="content">{{postDetail.content}}</text>
          <!-- 图片展示 -->
          <view class="image-list" v-if="postDetail.images && postDetail.images.length">
            <image 
              v-for="(img, index) in postDetail.images" 
              :key="index"
              :src="img"
              mode="widthFix"
              @tap="previewImage(index)"
            />
          </view>
        </view>
        
        <!-- 操作栏 -->
        <view class="action-bar">
          <view class="action-item" @tap="handleLike">
            <text class="iconfont" :class="postDetail.isLiked ? 'icon-like-fill' : 'icon-like'"></text>
            <text class="count">likes:{{postDetail.likes}}</text>
          </view>
          <view class="action-item">
            <text class="iconfont icon-comment"></text>
            <text class="count">comments:{{postDetail.comments}}</text>
          </view>
          <view class="action-item" @tap="handleShare">
            <text class="iconfont icon-share"></text>
            <text class="count">分享</text>
          </view>
        </view>
      </view>
      
      <!-- 评论区 -->
      <view class="comment-section">
        <view class="section-title">评论 {{postDetail.comments}}</view>
        <view class="comment-list">
          <view 
            class="comment-item"
            v-for="(comment, index) in commentList"
            :key="index"
          >
            <image class="avatar" :src="comment.avatar" mode="aspectFill"/>
            
            <view class="comment-main">
              <view class="comment-header">
                <text class="username">{{comment.username}}</text>
              </view>
              
              <text class="comment-text">{{comment.content}}</text>
              
              <view class="comment-footer">
                <text class="time">{{comment.time}}</text>
                <text class="reply-btn" @tap="showReplyInput(comment)">回复</text>
              </view>
              
              <!-- 回复输入框 -->
              <view class="reply-input-wrapper" v-if="comment.showReplyInput">
                <input 
                  class="reply-input"
                  v-model="replyText"
                  :placeholder="'回复 ' + comment.username"
                  @confirm="submitReply(comment)"
                  focus
                />
                <view class="reply-actions">
                  <text class="cancel-btn" @tap="hideReplyInput(comment)">取消</text>
                  <text class="submit-btn" @tap="submitReply(comment)">发送</text>
                </view>
              </view>
              
              <!-- 回复列表 -->
              <view class="reply-list" v-if="comment.replies && comment.replies.length">
                <view class="reply-item" v-for="(reply, replyIndex) in comment.replies" :key="replyIndex">
                  <text class="reply-user">{{reply.username}}</text>
                  <text class="reply-text">{{reply.content}}</text>
                </view>
              </view>
            </view>

            <view class="comment-right">
              <view class="operation-btn" @tap="handleCommentOperation(comment)">
                {{ isCurrentUser(comment) ? '删除' : '举报' }}
              </view>
              
              <view class="vote-btns">
                <view class="vote-item" @tap="handleCommentLike(comment)">
                  <text class="iconfont" :class="comment.isLiked ? 'icon-like-fill' : 'icon-like'"></text>
                  <text class="count">{{comment.likes || 0}}</text>
                </view>
                <view class="vote-item" @tap="handleCommentDislike(comment)">
                  <text class="iconfont" :class="comment.isDisliked ? 'icon-dislike-fill' : 'icon-dislike'"></text>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
    
    <!-- 底部评论框 -->
    <view class="comment-bar">
      <view class="input-wrapper">
        <text class="iconfont icon-emoji" @tap="toggleEmojiPanel"></text>
        <input 
          class="comment-input"
          v-model="commentText"
          placeholder="说点什么..."
          @confirm="submitComment"
        />
      </view>
      <text class="send-btn" @tap="submitComment">发送</text>
    </view>
    
    <!-- 表情面板 -->
    <view class="emoji-panel" v-if="showEmoji">
      <scroll-view scroll-y class="emoji-list">
        <text 
          v-for="(emoji, index) in emojiList" 
          :key="index"
          class="emoji-item"
          @tap="insertEmoji(emoji)"
        >{{emoji}}</text>
      </scroll-view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      postId: '',
      commentText: '',
      postDetail: {
        username: '用户名',
        avatar: 'https://via.placeholder.com/80x80',
        time: '2024-01-20 12:00',
        title: '帖子标题',
        content: '这是帖子详细内容...',
        images: ['https://via.placeholder.com/300x200'],
        likes: 128,
        comments: 36,
        isLiked: false,
        isFollowed: false
      },
      commentList: [
        {
          username: '评论用户1',
          userId: '456',
          avatar: 'https://via.placeholder.com/80x80',
          time: '10分钟前',
          content: '这是一条评论内容',
          likes: 12,
          isLiked: false,
          isDisliked: false,
          replies: [
            {
              username: '回复用户1',
              userId: '123',
              content: '这是一条回复内容',
              time: '8分钟前',
              likes: 3,
              isLiked: false,
              isDisliked: false
            }
          ]
        },
        {
          username: '评论用户2',
          userId: '789',
          avatar: 'https://via.placeholder.com/80x80',
          time: '15分钟前',
          content: '非常棒的分享！',
          likes: 8,
          isLiked: false,
          isDisliked: false,
          replies: []
        },
        {
          username: '评论用户3',
          userId: '101',
          avatar: 'https://via.placeholder.com/80x80',
          time: '20分钟前',
          content: '期待更多内容',
          likes: 5,
          isLiked: false,
          isDisliked: false,
          replies: [
            {
              username: '回复用户2',
              userId: '102',
              content: '我也是',
              time: '18分钟前',
              likes: 2,
              isLiked: false,
              isDisliked: false
            },
            {
              username: '回复用户3',
              userId: '103',
              content: '+1',
              time: '15分钟前',
              likes: 1,
              isLiked: false,
              isDisliked: false
            }
          ]
        }
      ],
      replyText: '',
      likeAnimation: false,
      showEmoji: false,
      emojiList: [],
      currentUserId: '123',
    }
  },
  onLoad(options) {
    this.postId = options.id
    // 从本地存储获取帖子数据
    try {
      const pages = getCurrentPages()
      const prevPage = pages[pages.length - 2]
      if (prevPage && prevPage.$vm.postList) {
        const post = prevPage.$vm.postList.find(p => p.id == this.postId)
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
          }
        }
      }
    } catch (e) {
      console.error('获取帖子详情失败:', e)
    }
  },
  methods: {
    handleFollow() {
      this.postDetail.isFollowed = !this.postDetail.isFollowed
      
      // 同步到��表页
      try {
        const pages = getCurrentPages()
        const prevPage = pages[pages.length - 2]
        if (prevPage && prevPage.$vm.postList) {
          const post = prevPage.$vm.postList.find(p => p.id == this.postId)
          if (post) {
            post.isFollowed = this.postDetail.isFollowed
          }
        }
      } catch (e) {
        console.error('同步关注状态失败:', e)
      }
      
      uni.showToast({
        title: this.postDetail.isFollowed ? '已关注' : '已取消关注',
        icon: 'success'
      })
    },
    
    handleLike() {
      this.postDetail.isLiked = !this.postDetail.isLiked
      this.postDetail.likes += this.postDetail.isLiked ? 1 : -1
      
      // 同步到列表页
      try {
        const pages = getCurrentPages()
        const prevPage = pages[pages.length - 2]
        if (prevPage && prevPage.$vm.postList) {
          const post = prevPage.$vm.postList.find(p => p.id == this.postId)
          if (post) {
            post.isLiked = this.postDetail.isLiked
            post.likes = this.postDetail.likes
          }
        }
        
        // 更新本地存储的点赞状态
        const likedPosts = uni.getStorageSync('likedPosts') || {}
        if (this.postDetail.isLiked) {
          likedPosts[this.postId] = true
        } else {
          delete likedPosts[this.postId]
        }
        uni.setStorageSync('likedPosts', likedPosts)
      } catch (e) {
        console.error('同步点赞状态失败:', e)
      }
    },
    
    handleShare() {
      uni.showActionSheet({
        itemList: ['分享到朋友圈', '分享给好友', '复制链接'],
        success: (res) => {
          switch(res.tapIndex) {
            case 0:
              this.shareToTimeline()
              break
            case 1:
              this.shareToFriend()
              break
            case 2:
              this.copyLink()
              break
          }
        }
      })
    },
    
    shareToTimeline() {
      // 模拟分享到朋友圈
      uni.showToast({
        title: '分享到朋友圈',
        icon: 'none'
      })
    },
    
    shareToFriend() {
      // 模拟分享给好友
      uni.showToast({
        title: '分享给好友',
        icon: 'none'
      })
    },
    
    copyLink() {
      // 模拟复制链接
      uni.setClipboardData({
        data: `https://example.com/post/${this.postId}`,
        success: () => {
          uni.showToast({
            title: '链接已复制',
            icon: 'success'
          })
        }
      })
    },
    
    previewImage(index) {
      // 添加预览动画
      const currentImage = this.postDetail.images[index]
      uni.previewImage({
        current: currentImage,
        urls: this.postDetail.images,
        indicator: 'number',
        loop: true,
        success: () => {
          console.log('预览成功')
        },
        fail: () => {
          uni.showToast({
            title: '预览失败',
            icon: 'none'
          })
        }
      })
    },
    
    submitComment() {
      if (!this.commentText.trim()) return
      
      const newComment = {
        username: '当前用户',
        userId: this.currentUserId,
        avatar: 'https://via.placeholder.com/80x80',
        time: '刚刚',
        content: this.commentText,
        likes: 0,
        isLiked: false,
        isDisliked: false,
        replies: []
      }
      
      this.commentList.unshift(newComment)
      this.postDetail.comments++
      this.commentText = ''
      
      // 同步到列表页
      try {
        const pages = getCurrentPages()
        const prevPage = pages[pages.length - 2]
        if (prevPage && prevPage.$vm.postList) {
          const post = prevPage.$vm.postList.find(p => p.id == this.postId)
          if (post) {
            post.comments = this.postDetail.comments
          }
        }
      } catch (e) {
        console.error('同步评论数失败:', e)
      }
      
      uni.showToast({
        title: '评论成功',
        icon: 'success'
      })
    },
    
    // 评论点赞
    handleCommentLike(comment) {
      if (!comment.likes) comment.likes = 0
      comment.isLiked = !comment.isLiked
      comment.likes += comment.isLiked ? 1 : -1
      
      // 添加点赞动画
      this.$set(comment, 'likeAnimation', true)
      setTimeout(() => {
        this.$set(comment, 'likeAnimation', false)
      }, 300)
    },
    
    // 显示回复输入框
    showReplyInput(comment) {
      this.commentList.forEach(item => {
        this.$set(item, 'showReplyInput', false)
      })
      this.$set(comment, 'showReplyInput', true)
      this.replyText = ''
    },
    
    // 隐藏回复输入框
    hideReplyInput(comment) {
      this.$set(comment, 'showReplyInput', false)
      this.replyText = ''
    },
    
    // 提交回复
    submitReply(comment) {
      if (!this.replyText.trim()) {
        uni.showToast({
          title: '请输入回复内容',
          icon: 'none'
        })
        return
      }
      
      if (!comment.replies) {
        this.$set(comment, 'replies', [])
      }
      
      const reply = {
        username: '当前用户',
        userId: this.currentUserId,
        content: this.replyText,
        time: '刚刚',
        likes: 0,
        isLiked: false,
        isDisliked: false
      }
      
      comment.replies.push(reply)
      
      // 清空并隐藏输入框
      this.hideReplyInput(comment)
      
      // 提示成功
      uni.showToast({
        title: '回复成功',
        icon: 'success'
      })
    },
    
    // 显示评论操作菜单
    showCommentOptions(comment) {
      uni.showActionSheet({
        itemList: ['删除', '举报'],
        success: (res) => {
          switch(res.tapIndex) {
            case 0:
              this.deleteComment(comment)
              break
            case 1:
              this.reportComment(comment)
              break
          }
        }
      })
    },
    
    // 删除评论
    deleteComment(comment) {
      uni.showModal({
        title: '提示',
        content: '确定要删除这条评论吗？',
        success: (res) => {
          if (res.confirm) {
            const index = this.commentList.indexOf(comment)
            if (index > -1) {
              this.commentList.splice(index, 1)
              this.postDetail.comments--
              uni.showToast({
                title: '删除成功',
                icon: 'success'
              })
            }
          }
        }
      })
    },
    
    // 举报评论
    reportComment(comment) {
      uni.showActionSheet({
        itemList: ['垃圾广告', '违法违规', '色情低俗', '攻击谩骂', '其他'],
        success: (res) => {
          uni.showToast({
            title: '举报成功',
            icon: 'success'
          })
        }
      })
    },
    
    // 切换表情面板
    toggleEmojiPanel() {
      this.showEmoji = !this.showEmoji
    },
    
    // 插入表情
    insertEmoji(emoji) {
      this.commentText += emoji
    },
    
    isCurrentUser(comment) {
      // 这里需要根据你的用户系统来判断是否是当前用户
      return comment.userId === this.currentUserId
    },
    
    handleCommentOperation(comment) {
      if (this.isCurrentUser(comment)) {
        this.deleteComment(comment)
      } else {
        this.reportComment(comment)
      }
    },
    
    handleCommentDislike(comment) {
      if (comment.isDisliked) {
        comment.isDisliked = false
      } else {
        comment.isDisliked = true
        if (comment.isLiked) {
          comment.isLiked = false
          comment.likes--
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.detail-container {
  min-height: 100vh;
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
}

.content-scroll {
  flex: 1;
  height: calc(100vh - 100rpx);
}

.post-content {
  background: #fff;
  padding: 30rpx;
  margin-bottom: 20rpx;
  
  .user-info {
    display: flex;
    align-items: center;
    margin-bottom: 30rpx;
    
    .avatar {
      width: 80rpx;
      height: 80rpx;
      border-radius: 50%;
      margin-right: 20rpx;
    }
    
    .info {
      flex: 1;
      
      .username {
        font-size: 32rpx;
        font-weight: bold;
        color: #333;
        display: block;
      }
      
      .time {
        font-size: 24rpx;
        color: #999;
        margin-top: 6rpx;
      }
    }
    
    .follow-btn {
      min-width: 120rpx;
      height: 56rpx;
      line-height: 56rpx;
      font-size: 26rpx;
      color: #007AFF;
      background: #f0f9ff;
      border-radius: 28rpx;
      padding: 0 30rpx;
      
      &:active {
        opacity: 0.8;
        transform: scale(0.98);
      }
    }
  }
  
  .post-body {
    .title {
      font-size: 36rpx;
      font-weight: bold;
      color: #333;
      margin-bottom: 20rpx;
      display: block;
    }
    
    .content {
      font-size: 30rpx;
      color: #666;
      line-height: 1.6;
      margin-bottom: 30rpx;
      display: block;
    }
    
    .image-list {
      image {
        width: 100%;
        border-radius: 12rpx;
        margin-bottom: 20rpx;
        transition: all 0.3s ease;
        
        &:active {
          transform: scale(0.98);
          opacity: 0.8;
        }
        
        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }
  
  .action-bar {
    display: flex;
    justify-content: space-around;
    margin-top: 30rpx;
    padding-top: 30rpx;
    border-top: 1rpx solid #eee;
    
    .action-item {
      display: flex;
      align-items: center;
      
      .iconfont {
        font-size: 40rpx;
        color: #999;
        margin-right: 10rpx;
        transition: all 0.3s ease;
        
        &.icon-like-fill {
          color: #ff4d4f;
          animation: likeScale 0.3s ease;
        }
      }
      
      .count {
        font-size: 26rpx;
        color: #999;
      }
      
      &:active {
        opacity: 0.8;
        transform: scale(0.95);
      }
    }
  }
}

.comment-section {
  background: #fff;
  padding: 30rpx;
  
  .section-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 30rpx;
  }
  
  .comment-list {
    .comment-item {
      display: flex;
      padding: 20rpx;
      border-bottom: 1rpx solid #eee;
      
      .avatar {
        width: 80rpx;
        height: 80rpx;
        border-radius: 50%;
        margin-right: 20rpx;
      }
      
      .comment-main {
        flex: 1;
        margin-right: 20rpx;
        
        .comment-header {
          margin-bottom: 10rpx;
          
          .username {
            font-size: 28rpx;
            font-weight: bold;
            color: #333;
          }
        }
        
        .comment-text {
          font-size: 28rpx;
          color: #333;
          line-height: 1.5;
          margin-bottom: 10rpx;
        }
        
        .comment-footer {
          display: flex;
          align-items: center;
          margin-top: 10rpx;
          
          .time {
            font-size: 24rpx;
            color: #999;
            margin-right: 20rpx;
          }
          
          .reply-btn {
            font-size: 24rpx;
            color: #666;
            padding: 4rpx 12rpx;
            
            &:active {
              opacity: 0.7;
            }
          }
        }
        
        .reply-input-wrapper {
          margin-top: 20rpx;
          padding: 20rpx;
          background: #f8f8f8;
          border-radius: 8rpx;
          
          .reply-input {
            width: 100%;
            height: 72rpx;
            background: #fff;
            border-radius: 36rpx;
            padding: 0 30rpx;
            font-size: 28rpx;
            color: #333;
          }
          
          .reply-actions {
            display: flex;
            justify-content: flex-end;
            margin-top: 20rpx;
            
            text {
              font-size: 28rpx;
              padding: 10rpx 20rpx;
              border-radius: 4rpx;
              
              &.cancel-btn {
                color: #999;
                margin-right: 20rpx;
                
                &:active {
                  opacity: 0.7;
                }
              }
              
              &.submit-btn {
                color: #fff;
                background: #007AFF;
                
                &:active {
                  opacity: 0.8;
                }
              }
            }
          }
        }
        
        .reply-list {
          margin-top: 20rpx;
          padding: 20rpx;
          background: #f8f8f8;
          border-radius: 8rpx;
          
          .reply-item {
            display: flex;
            align-items: flex-start;
            margin-bottom: 16rpx;
            
            &:last-child {
              margin-bottom: 0;
            }
            
            .reply-user {
              font-size: 26rpx;
              color: #007AFF;
              margin-right: 10rpx;
            }
            
            .reply-text {
              flex: 1;
              font-size: 26rpx;
              color: #333;
              line-height: 1.5;
            }
          }
        }
      }
      
      .comment-right {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: flex-end;
        
        .operation-btn {
          font-size: 24rpx;
          color: #999;
          padding: 4rpx 12rpx;
          
          &:active {
            opacity: 0.7;
          }
        }
        
        .vote-btns {
          display: flex;
          align-items: center;
          
          .vote-item {
            display: flex;
            align-items: center;
            margin-left: 20rpx;
            
            .iconfont {
              font-size: 36rpx;
              color: #999;
              
              &.icon-like-fill {
                color: #007AFF;
              }
              
              &.icon-dislike-fill {
                color: #ff4d4f;
              }
            }
            
            .count {
              font-size: 24rpx;
              color: #999;
              margin-left: 4rpx;
            }
          }
        }
      }
    }
  }
}

.comment-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100rpx;
  background: #fff;
  display: flex;
  align-items: center;
  padding: 0 30rpx;
  box-shadow: 0 -2rpx 10rpx rgba(0,0,0,0.05);
  z-index: 99;
}

.emoji-panel {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 100rpx;
  height: 400rpx;
  background: #fff;
  box-shadow: 0 -2rpx 10rpx rgba(0,0,0,0.05);
  z-index: 100;
  transform-origin: bottom;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

@keyframes likeScale {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}
</style> 