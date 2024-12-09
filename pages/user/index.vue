<template>
  <view class="user-container">
    <!-- 用户信息头部 -->
    <view class="user-header" v-if="isLogin">
      <view class="user-info">
        <image class="avatar" :src="userInfo.avatar" mode="aspectFill"/>
        <view class="info-content">
          <text class="nickname">{{userInfo.nickname}}</text>
          <text class="user-id">ID: {{userInfo.userId}}</text>
        </view>
      </view>
      <view class="vip-card">
        <view class="vip-info">
          <text class="vip-title">会员等级</text>
          <text class="vip-level">Lv.{{userInfo.level}}</text>
        </view>
        <text class="vip-desc">已累计获得{{userInfo.points}}积分</text>
      </view>
    </view>
    
    <!-- 未登录状态 -->
    <view class="login-header" v-else @tap="goToLogin">
      <image class="default-avatar" src="https://via.placeholder.com/300x200" mode="aspectFill"/>
      <text class="login-text">点击登录</text>
      <text class="login-desc">登录后享受更多服务</text>
    </view>
    
    <!-- 功能菜单 -->
    <view class="menu-section">
      <view class="menu-title">{{ isLogin ? '我的服务' : '全部服务' }}</view>
      <view class="menu-grid">
        <view class="menu-item" v-for="(item, index) in menuList" :key="index" @tap="handleMenu(item)">
          <text class="iconfont" :class="item.icon"></text>
          <text class="menu-name">{{item.name}}</text>
          <text class="login-tip" v-if="!isLogin">未登录</text>
        </view>
      </view>
    </view>
    
    <!-- 列表菜单 -->
    <view class="list-menu">
      <view 
        class="list-item" 
        v-for="(item, index) in listMenu" 
        :key="index"
        @tap="handleListMenu(item)"
        :class="{ 'disabled': !isLogin && !item.public }"
      >
        <view class="item-left">
          <text class="iconfont" :class="item.icon"></text>
          <text class="item-name">{{item.name}}</text>
        </view>
        <text class="iconfont icon-arrow-right"></text>
      </view>
    </view>
    
    <!-- 退出登录按钮 -->
    <button class="logout-btn" v-if="isLogin" @tap="handleLogout">退出登录</button>
  </view>
</template>

<script>
export default {
  data() {
    return {
      userInfo: { 
        nickname: '',
        userId: '',
        avatar: 'https://via.placeholder.com/80x80',
        level: 1,
        points: 0
      },
      isLogin: uni.getStorageSync('isLoggedIn') || false,
      menuList: [
        { name: '购车订单', icon: 'icon-order', type: 'order' },
        { name: '预约试驾', icon: 'icon-test-drive', type: 'test-drive' },
        { name: '维修保养', icon: 'icon-repair', type: 'repair' },
        { name: '积分中心', icon: 'icon-points', type: 'points' }
      ],
      listMenu: [
        { name: '个人资料', icon: 'icon-profile', type: 'profile', public: false },
        { name: '客服热线', icon: 'icon-service', type: 'service', public: true },
        { name: '关于我们', icon: 'icon-about', type: 'about', public: true }
      ]
    }
  },
  onShow() {
    // 每次显示页面时更新用户信息和登录状态
    const userInfo = uni.getStorageSync('userInfo')
    this.isLogin = uni.getStorageSync('isLoggedIn')
    this.updateUserInfo(userInfo)
  },
  onLoad() {
    // 监听登录成功事件
    uni.$on('loginSuccess', this.updateUserInfo)
  },
  onUnload() {
    // 移除事件监听
    uni.$off('loginSuccess', this.updateUserInfo)
  },
  methods: {
    goToLogin() {
      uni.navigateTo({
        url: '/pages/login/index'
      })
    },
    handleMenu(item) {
      if (!this.isLogin) {
        this.goToLogin()
        return
      }
      
      switch(item.type) {
        case 'order':
          uni.navigateTo({ url: '/pages/user/order' })
          break
        case 'test-drive':
          uni.navigateTo({ 
            url: '/pages/user/test-drive-list',
            fail: () => {
              uni.showToast({
                title: '跳转失败',
                icon: 'none'
              })
            }
          })
          break
        case 'repair':
          uni.navigateTo({ url: '/pages/user/repair' })
          break
        case 'points':
          uni.navigateTo({ url: '/pages/user/points' })
          break
      }
    },
    handleListMenu(item) {
      if (!this.isLogin && !item.public) {
        this.goToLogin()
        return
      }
      
      switch(item.type) {
        case 'profile':
          uni.navigateTo({ url: '/pages/user/profile' })
          break
        case 'service':
          uni.makePhoneCall({
            phoneNumber: '400-123-4567',
            fail() {
              uni.showToast({
                title: '拨打失败，请稍后重试',
                icon: 'none'
              })
            }
          })
          break
        case 'about':
          uni.navigateTo({ url: '/pages/user/about' })
          break
      }
    },
    handleLogout() {
      uni.showModal({
        title: '提示',
        content: '确定要退出登录吗？',
        success: (res) => {
          if (res.confirm) {
            uni.removeStorageSync('userInfo')
            uni.removeStorageSync('isLoggedIn')
            this.isLogin = false
            this.userInfo = {
              nickname: '',
              userId: '',
              avatar: '/static/default-avatar.png',
              level: 1,
              points: 0
            }
            uni.showToast({
              title: '已退出登录',
              icon: 'success'
            })
          }
        }
      })
    },
    updateUserInfo(userInfo) {
      if (userInfo) {
        this.userInfo = {
          nickname: userInfo.username,
          userId: Date.now().toString().slice(-6),
          avatar: 'https://via.placeholder.com/80x80',
          level: 1,
          points: 0
        }
        this.isLogin = true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.user-container {
  min-height: 100vh;
  background: #f5f5f5;
}

.user-header {
  background: linear-gradient(180deg, #007AFF, #1989fa);
  padding: 40rpx 30rpx;
  color: #fff;
  margin-top: 0;
  min-height: 300rpx;
  position: relative;
  
  .user-info {
    display: flex;
    align-items: center;
    margin-bottom: 30rpx;
    
    .avatar {
      width: 120rpx;
      height: 120rpx;
      border-radius: 60rpx;
      border: 4rpx solid rgba(255,255,255,0.3);
      background: #fff;
    }
    
    .info-content {
      margin-left: 20rpx;
      
      .nickname {
        font-size: 36rpx;
        font-weight: bold;
        margin-bottom: 10rpx;
        display: block;
      }
      
      .user-id {
        font-size: 24rpx;
        opacity: 0.8;
      }
    }
  }
  
  .vip-card {
    background: rgba(255,255,255,0.1);
    border-radius: 12rpx;
    padding: 20rpx;
    
    .vip-info {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10rpx;
      
      .vip-title {
        font-size: 28rpx;
      }
      
      .vip-level {
        font-size: 28rpx;
        font-weight: bold;
      }
    }
    
    .vip-desc {
      font-size: 24rpx;
      opacity: 0.8;
    }
  }
}

.login-header {
  background: linear-gradient(180deg, #007AFF, #1989fa);
  padding: 60rpx 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 0;
  min-height: 300rpx;
  position: relative;
  justify-content: center;
  
  .default-avatar {
    width: 120rpx;
    height: 120rpx;
    border-radius: 60rpx;
    margin-bottom: 20rpx;
    background: #fff;
    border: 4rpx solid rgba(255,255,255,0.3);
  }
  
  .login-text {
    color: #fff;
    font-size: 32rpx;
    margin-bottom: 10rpx;
    font-weight: bold;
  }
  
  .login-desc {
    color: rgba(255, 255, 255, 0.8);
    font-size: 24rpx;
  }

  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 40rpx;
    background: #f5f5f5;
    border-radius: 40rpx 40rpx 0 0;
  }
}

.menu-section {
  background: #fff;
  margin: 20rpx;
  border-radius: 12rpx;
  padding: 30rpx;
  position: relative;
  z-index: 1;
  
  .menu-title {
    font-size: 32rpx;
    font-weight: bold;
    margin-bottom: 30rpx;
  }
  
  .menu-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20rpx;
    
    .menu-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      
      .iconfont {
        font-size: 48rpx;
        color: #007AFF;
        margin-bottom: 10rpx;
      }
      
      .menu-name {
        font-size: 24rpx;
        color: #333;
      }
      
      .login-tip {
        font-size: 20rpx;
        color: #999;
        margin-top: 4rpx;
      }
    }
  }
}

.list-menu {
  background: #fff;
  margin: 20rpx;
  border-radius: 12rpx;
  
  .list-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 30rpx;
    border-bottom: 1rpx solid #eee;
    
    &:last-child {
      border-bottom: none;
    }
    
    .item-left {
      display: flex;
      align-items: center;
      
      .iconfont {
        font-size: 40rpx;
        color: #007AFF;
        margin-right: 20rpx;
      }
      
      .item-name {
        font-size: 28rpx;
        color: #333;
      }
    }
    
    .icon-arrow-right {
      font-size: 32rpx;
      color: #999;
    }
    
    &.disabled {
      opacity: 0.6;
      
      .item-name {
        color: #999;
      }
      
      .icon-arrow-right {
        color: #ccc;
      }
    }
  }
}

.logout-btn {
  margin: 40rpx 20rpx;
  background: #fff;
  color: #ff4d4f;
  font-size: 32rpx;
  border-radius: 12rpx;
  
  &:active {
    opacity: 0.8;
  }
}
</style> 