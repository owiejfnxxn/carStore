<template>
  <view class="forum-container">
    <!-- 搜索框 -->
    <view class="search-box">
      <text class="iconfont icon-search"></text>
      <input 
        type="text" 
        v-model="searchKey"
        placeholder="搜索帖子" 
        @confirm="handleSearch"
      />
    </view>
    
    <!-- 排序选项 -->
    <scroll-view class="sort-scroll" scroll-x>
      <view 
        class="sort-item" 
        v-for="(item, index) in sortOptions" 
        :key="index"
        :class="{ active: currentSort === index }"
        @tap="switchSort(index)"
      >
        {{item.name}}
        <text class="iconfont icon-sort" v-if="item.sortable"></text>
      </view>
    </scroll-view>
    
    <!-- 帖子列表 -->
    <scroll-view 
      class="post-list" 
      scroll-y 
      refresher-enabled
      :refresher-triggered="isRefreshing"
      @refresherrefresh="onRefresh"
      @scrolltolower="onLoadMore"
    >
      <!-- 帖子项 -->
      <view 
        class="post-item"
        v-for="(post, index) in postList"
        :key="post.id"
        @tap="goToDetail(post.id)"
      >
        <view class="post-header">
          <image class="avatar" :src="post.avatar" mode="aspectFill"/>
          <view class="user-info">
            <text class="username">{{post.username}}</text>
            <text class="time">{{post.time}}</text>
          </view>
          <button 
            class="follow-btn" 
            :class="{ active: post.isFollowed }"
            @tap.stop="handleFollow(post)"
          >
            {{post.isFollowed ? '已关注' : '关注'}}
          </button>
        </view>
        
        <view class="post-content">
          <text class="title">{{post.title}}</text>
          <text class="content">{{post.content}}</text>
          <!-- 图片网格 -->
          <view class="image-grid" v-if="post.images && post.images.length">
            <view 
              class="image-item"
              v-for="(img, imgIndex) in post.images.slice(0, 3)"
              :key="imgIndex"
              @tap.stop="previewImage(post.images, imgIndex)"
            >
              <image :src="img" mode="aspectFill"/>
              <text class="image-count" v-if="imgIndex === 2 && post.images.length > 3">
                +{{post.images.length - 3}}
              </text>
            </view>
          </view>
        </view>
        
        <view class="post-footer">
          <view class="action-item" @tap.stop="handleLike(post)">
            <text class="iconfont" :class="post.isLiked ? 'icon-like-fill' : 'icon-like'"></text>
            <text 
              class="count" 
              :class="{ 
                'liked': post.isLiked,
                'like-animate': likeAnimations[post.id]
              }"
            >likes:{{post.likes}}</text>
          </view>
          <view class="action-item">
            <text class="iconfont icon-comment"></text>
            <text class="count">comments:{{post.comments}}</text>
          </view>
          <view class="action-item" @tap.stop="handleShare(post)">
            <text class="iconfont icon-share"></text>
            <text class="count">分享</text>
          </view>
        </view>
      </view>
      
      <!-- 加载状态 -->
      <view class="loading-more" v-if="isLoading">
        <text class="iconfont icon-loading"></text>
        <text>加载中...</text>
      </view>
      <view class="no-more" v-if="noMore">
        <text>没有更多内容了</text>
      </view>
    </scroll-view>
    
    <!-- 发帖按钮 -->
    <view class="post-btn" @tap="createPost">
      <text class="iconfont icon-edit">+</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      searchKey: '',
      currentSort: 0,
      sortOptions: [
        { name: '最新', key: 'time' },
        { name: '热度', key: 'likes', sortable: true }
      ],
      originalPosts: [],
      postList: [],
      page: 1,
      isLoading: false,
      isRefreshing: false,
      noMore: false,
      defaultAvatar: 'https://via.placeholder.com/80x80',
      defaultImage: 'https://via.placeholder.com/300x200',
      likeAnimations: {}
    }
  },
  
  onLoad() {
    this.initData()
  },
  
  methods: {
    // 初始化数据
    initData() {
      const initialPosts = [
        {
          id: 1,
          username: '测试用户1',
          avatar: 'https://via.placeholder.com/80x80',
          time: '2024-01-20 12:00',
          title: '春风NK400使用体验分享',
          content: '最近入手了一台春风NK400，来分享一下使用体验。整车动力充沛，制动性能出色...',
          images: [
            'https://via.placeholder.com/300x200',
            'https://via.placeholder.com/300x200'
          ],
          likes: 120,
          comments: 36,
          isLiked: false,
          isFollowed: false
        },
        {
          id: 2,
          username: '多图片测试2',
          avatar: 'https://via.placeholder.com/80x80',
          time: '2024-01-20 11:30',
          title: '周末骑行路线推荐',
          content: '分享一条适合周末骑行的路线，风景优美，路况良好...',
          images: [
            'https://via.placeholder.com/300x200',
            'https://via.placeholder.com/300x200',
            'https://via.placeholder.com/300x200',
            'https://via.placeholder.com/300x200',
            'https://via.placeholder.com/300x200'
            
          ],
          likes: 88,
          comments: 25,
          isLiked: false,
          isFollowed: false
        }
      ]
      this.originalPosts = [...initialPosts]
      this.postList = [...initialPosts]
      this.loadPosts()
    },
    
    // 加载帖子数据
    async loadPosts(type = 'more') {
      if (this.isLoading || (type === 'more' && this.noMore)) return
      
      this.isLoading = true
      
      try {
        // 模拟数据加载
        const newPosts = Array(5).fill({}).map((_, index) => ({
          id: this.postList.length + index + 1,
          username: `用户${Math.floor(Math.random() * 1000)}`,
          avatar: 'https://via.placeholder.com/80x80',
          time: new Date().toLocaleString(),
          title: `测试帖子标题 ${this.postList.length + index + 1}`,
          content: '这是帖子内容，描述了一些有趣的事情...',
          images: [
            'https://via.placeholder.com/300x200',
            'https://via.placeholder.com/300x200',
            'https://via.placeholder.com/300x200',
            'https://via.placeholder.com/300x200',
            'https://via.placeholder.com/300x200',
            'https://via.placeholder.com/300x200',
            'https://via.placeholder.com/300x200',
            'https://via.placeholder.com/300x200',
            'https://via.placeholder.com/300x200'
          ].slice(0, Math.floor(Math.random() * 9) + 1),
          likes: Math.floor(Math.random() * 100),
          comments: Math.floor(Math.random() * 30),
          isLiked: false,
          isFollowed: false
        }))
        
        // 恢复点赞状态
        this.initLikeStatus(newPosts);
        
        let updatedPosts = []
        if (type === 'refresh') {
          updatedPosts = newPosts
          this.originalPosts = [...newPosts]
          this.page = 1
          this.noMore = false
        } else {
          updatedPosts = [...this.postList, ...newPosts]
          this.originalPosts = [...this.originalPosts, ...newPosts]
          this.page++
        }
        
        // 根据当前排序方式对所有数据进行排序
        this.applySort(updatedPosts)
        this.postList = updatedPosts
        
        // 模拟数据加载完毕
        if (this.page >= 3) {
          this.noMore = true
        }
        
      } catch (error) {
        console.error('加载失败:', error)
        uni.showToast({
          title: '加载失败',
          icon: 'none'
        })
      } finally {
        this.isLoading = false
        if (type === 'refresh') {
          this.isRefreshing = false
        }
      }
    },
    
    // 抽取排序逻辑为单独的方法
    applySort(posts) {
      switch(this.sortOptions[this.currentSort].key) {
        case 'time':
          posts.sort((a, b) => new Date(b.time) - new Date(a.time))
          break
        case 'likes':
          posts.sort((a, b) => b.likes - a.likes)
          break
      }
      return posts
    },
    
    // 跳转到帖子详情
    goToDetail(id) {
      uni.navigateTo({
        url: `/pages/forum/detail?id=${id}`,
        fail: (err) => {
          console.error('跳转失败:', err)
          uni.showToast({
            title: '页面跳转失败',
            icon: 'none'
          })
        }
      })
    },
    
    // 处理关注
    handleFollow(post) {
      post.isFollowed = !post.isFollowed
      uni.showToast({
        title: post.isFollowed ? '已关注' : '已取消关注',
        icon: 'success'
      })
    },
    
    // 处理点赞
    handleLike(post) {
      // 防止重复点击
      if (this.likeAnimations[post.id]) return;
      
      // 更新点赞状态
      post.isLiked = !post.isLiked;
      post.likes += post.isLiked ? 1 : -1;
      
      // 添加点赞动画
      this.$set(this.likeAnimations, post.id, true);
      
      // 播放动画
      setTimeout(() => {
        this.$set(this.likeAnimations, post.id, false);
      }, 300);
      
      // 保存点赞状态到本地
      try {
        const likedPosts = uni.getStorageSync('likedPosts') || {};
        if (post.isLiked) {
          likedPosts[post.id] = true;
        } else {
          delete likedPosts[post.id];
        }
        uni.setStorageSync('likedPosts', likedPosts);
      } catch (e) {
        console.error('保存点赞状态失败:', e);
      }
      
      // 显示提示
      uni.showToast({
        title: post.isLiked ? '已点赞' : '已取消点赞',
        icon: 'none',
        duration: 1000
      });
    },
    
    // 处理分享
    handleShare(post) {
      uni.showActionSheet({
        itemList: ['分享给好友', '复制链接'],
        success: (res) => {
          if (res.tapIndex === 0) {
            uni.showToast({
              title: '分享成功',
              icon: 'success'
            })
          } else {
            uni.setClipboardData({
              data: `https://example.com/post/${post.id}`,
              success: () => {
                uni.showToast({
                  title: '链接已复制',
                  icon: 'success'
                })
              }
            })
          }
        }
      })
    },
    
    // 创建新帖子
    createPost() {
      uni.navigateTo({
        url: '/pages/forum/create'
      })
    },
    
    // 切换排序方式
    switchSort(index) {
      if (this.currentSort === index) return
      this.currentSort = index
      
      // 使用原始数据的副本进行排序
      const sortedPosts = [...this.originalPosts]
      this.postList = this.applySort(sortedPosts)
      
      // 显示排序提示
      uni.showToast({
        title: `按${this.sortOptions[index].name}排序`,
        icon: 'none',
        duration: 1500
      })
    },
    
    // 下拉刷
    async onRefresh() {
      this.isRefreshing = true;
      await this.loadPosts('refresh');
    },
    
    // 上拉加载更多
    onLoadMore() {
      if (!this.isLoading && !this.noMore) {
        this.loadPosts('more');
      }
    },
    
    // 搜索帖子
    handleSearch() {
      if (!this.searchKey.trim()) return;
      
      // 重置列表状态
      this.page = 1;
      this.noMore = false;
      
      // 模拟搜索结果
      const searchResult = this.postList.filter(post => 
        post.title.includes(this.searchKey) || 
        post.content.includes(this.searchKey)
      );
      
      this.postList = searchResult;
      if (searchResult.length === 0) {
        this.noMore = true;
        uni.showToast({
          title: '没有找到相关内容',
          icon: 'none'
        });
      }
    },
    
    // 在加载帖子时恢复点赞状态
    initLikeStatus(posts) {
      try {
        const likedPosts = uni.getStorageSync('likedPosts') || {};
        posts.forEach(post => {
          if (likedPosts[post.id]) {
            post.isLiked = true;
          }
        });
      } catch (e) {
        console.error('恢复点赞状态失败:', e);
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.forum-container {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 120rpx; // 为底部按钮留出空间
}

// 搜索框样式优化
.search-box {
  display: flex;
  align-items: center;
  background: #fff;
  padding: 20rpx 30rpx;
  border-bottom: 1rpx solid #eee;
  position: sticky;
  top: 0;
  z-index: 100;
  
  .iconfont {
    font-size: 32rpx;
    color: #999;
  }
  
  input {
    flex: 1;
    height: 64rpx;
    font-size: 28rpx;
    color: #333;
    background: #f5f5f5;
    border-radius: 32rpx;
    padding: 0 30rpx;
    margin-left: 20rpx;
  }
}

// 排序选项样式优化
.sort-scroll {
  background: #fff;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #eee;
  position: sticky;
  top: 104rpx;
  z-index: 99;
  
  .sort-item {
    display: inline-block;
    padding: 12rpx 40rpx;
    margin: 0 10rpx;
    font-size: 28rpx;
    color: #666;
    position: relative;
    border-radius: 26rpx;
    transition: all 0.3s;
    
    &.active {
      color: #007AFF;
      background: rgba(0, 122, 255, 0.1);
      font-weight: bold;
    }
    
    &:first-child {
      margin-left: 30rpx;
    }
    
    &:last-child {
      margin-right: 30rpx;
    }
  }
}

// 帖子列表样式优化
.post-list {
  padding: 20rpx;
  
  .post-item {
    background: #fff;
    border-radius: 16rpx;
    padding: 30rpx;
    margin-bottom: 20rpx;
    box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
    
    .post-header {
      display: flex;
      align-items: center;
      margin-bottom: 24rpx;
      
      .avatar {
        width: 80rpx;
        height: 80rpx;
        border-radius: 50%;
        margin-right: 20rpx;
        border: 1rpx solid #eee;
      }
      
      .user-info {
        flex: 1;
        
        .username {
          font-size: 28rpx;
          color: #333;
          font-weight: bold;
        }
        
        .time {
          font-size: 24rpx;
          color: #999;
          margin-top: 4rpx;
        }
      }
      
      .follow-btn {
        min-width: 120rpx;
        height: 52rpx;
        line-height: 52rpx;
        font-size: 24rpx;
        color: #007AFF;
        background: rgba(0, 122, 255, 0.1);
        border-radius: 26rpx;
        padding: 0 24rpx;
        
        &.active {
          color: #999;
          background: #f5f5f5;
        }
      }
    }
    
    .post-content {
      .title {
        font-size: 32rpx;
        font-weight: bold;
        color: #333;
        margin-bottom: 16rpx;
        line-height: 1.4;
      }
      
      .content {
        font-size: 28rpx;
        color: #666;
        line-height: 1.6;
        margin-bottom: 20rpx;
      }
      
      .image-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 10rpx;
        
        .image-item {
          position: relative;
          padding-bottom: 100%;
          
          image {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border-radius: 8rpx;
            object-fit: cover;
          }
          
          .image-count {
            position: absolute;
            right: 10rpx;
            bottom: 10rpx;
            background: rgba(0, 0, 0, 0.5);
            color: #fff;
            font-size: 24rpx;
            padding: 4rpx 12rpx;
            border-radius: 20rpx;
          }
        }
      }
    }
    
    .post-footer {
      display: flex;
      justify-content: space-around;
      margin-top: 30rpx;
      padding-top: 20rpx;
      border-top: 1rpx solid #f5f5f5;
      
      .action-item {
        display: flex;
        align-items: center;
        padding: 10rpx 30rpx;
        border-radius: 30rpx;
        transition: all 0.3s;
        
        &:active {
          background: #f5f5f5;
        }
        
        .iconfont {
          font-size: 36rpx;
          color: #999;
          margin-right: 8rpx;
          
          &.icon-like-fill {
            color: #ff4d4f;
          }
        }
        
        .count {
          font-size: 26rpx;
          color: #999;
          
          &.liked {
            color: #ff4d4f;
          }
          
          &.like-animate {
            animation: likeScale 0.3s ease;
          }
        }
      }
    }
  }
}

// 发帖按钮样式优化
.post-btn {
  position: fixed;
  right: 40rpx;
  bottom: 140rpx;
  width: 110rpx;
  height: 110rpx;
  background: linear-gradient(135deg, #007AFF, #0056b3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 16rpx rgba(0, 122, 255, 0.3);
  transition: all 0.3s;
  
  &:active {
    transform: scale(0.95);
  }
  
  .iconfont {
    font-size: 48rpx;
    color: #fff;
  }
}

// 加载状态样式优化
.loading-more,
.no-more {
  text-align: center;
  padding: 40rpx;
  color: #999;
  font-size: 24rpx;
  
  .icon-loading {
    display: inline-block;
    animation: rotate 1s linear infinite;
    margin-right: 8rpx;
  }
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

// 添加点赞动画
@keyframes likeScale {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}
</style> 