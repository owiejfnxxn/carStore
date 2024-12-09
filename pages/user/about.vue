<template>
  <view class="about-container">
    <!-- 品牌信息 -->
    <view class="brand-info">
      <image class="logo" src="/static/logo.png" mode="aspectFit"/>
      <text class="app-name">你很机车</text>
      <text class="version">Version 1.0.0</text>
    </view>
    
    <!-- 公司信息 -->
    <view class="info-section">
      <view class="section-title">公司介绍</view>
      <view class="company-desc">
        <text>{{companyDesc}}</text>
      </view>
    </view>
    
    <!-- 联系方式 -->
    <view class="info-section">
      <view class="section-title">联系我们</view>
      <view class="contact-list">
        <view class="contact-item" @tap="makeCall(contact.phone)">
          <text class="label">客服电话</text>
          <text class="value">{{contact.phone}}</text>
        </view>
        <view class="contact-item">
          <text class="label">营业时间</text>
          <text class="value">{{contact.hours}}</text>
        </view>
        <view class="contact-item">
          <text class="label">公司地址</text>
          <text class="value">{{contact.address}}</text>
        </view>
        <view class="contact-item">
          <text class="label">电子邮箱</text>
          <text class="value">{{contact.email}}</text>
        </view>
      </view>
    </view>
    
    <!-- 功能入口 -->
    <view class="action-list">
      <view class="action-item" @tap="checkUpdate">
        <text>检查更新</text>
        <text class="iconfont icon-arrow-right"></text>
      </view>
      <view class="action-item" @tap="showAgreement">
        <text>用户协议</text>
        <text class="iconfont icon-arrow-right"></text>
      </view>
      <view class="action-item" @tap="showPrivacy">
        <text>隐私政策</text>
        <text class="iconfont icon-arrow-right"></text>
      </view>
    </view>
    
    <!-- 版权信息 -->
    <view class="copyright">
      <text>Copyright © 2024 你很机车</text>
      <text>All Rights Reserved</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      companyDesc: '你很机车是一家专注于摩托车销售和服务的综合性平台，致力于为用户提供高品质的摩托车产品和专业的售后服务。我们拥有完善的销售网络和专业的技术团队，为广大摩托车爱好者提供优质的购车体验和贴心的售��保障。',
      contact: {
        phone: '400-123-4567',
        hours: '周一至周日 9:00-18:00',
        address: '上海市浦东新区xx路xx号',
        email: 'service@example.com'
      }
    }
  },
  
  methods: {
    makeCall(phone) {
      uni.makePhoneCall({
        phoneNumber: phone,
        fail() {
          uni.showToast({
            title: '拨打失败',
            icon: 'none'
          })
        }
      })
    },
    
    checkUpdate() {
      uni.showLoading({ title: '检查中...' })
      
      setTimeout(() => {
        uni.hideLoading()
        uni.showToast({
          title: '已是最新版本',
          icon: 'success'
        })
      }, 1000)
    },
    
    showAgreement() {
      uni.navigateTo({
        url: '/pages/common/agreement'
      })
    },
    
    showPrivacy() {
      uni.navigateTo({
        url: '/pages/common/privacy'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.about-container {
  min-height: 100vh;
  background: #f8f9fa;
  padding: 60rpx 30rpx;
}

.brand-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 60rpx;
  
  .logo {
    width: 160rpx;
    height: 160rpx;
    margin-bottom: 20rpx;
  }
  
  .app-name {
    font-size: 36rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 12rpx;
  }
  
  .version {
    font-size: 24rpx;
    color: #999;
  }
}

.info-section {
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  
  .section-title {
    font-size: 32rpx;
    font-weight: 500;
    color: #333;
    margin-bottom: 20rpx;
    
    &::before {
      content: '';
      display: inline-block;
      width: 6rpx;
      height: 24rpx;
      background: #007AFF;
      border-radius: 3rpx;
      margin-right: 12rpx;
      vertical-align: -3rpx;
    }
  }
  
  .company-desc {
    font-size: 28rpx;
    color: #666;
    line-height: 1.6;
  }
  
  .contact-list {
    .contact-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20rpx 0;
      
      &:not(:last-child) {
        border-bottom: 1rpx solid #eee;
      }
      
      .label {
        font-size: 28rpx;
        color: #333;
      }
      
      .value {
        font-size: 28rpx;
        color: #666;
      }
    }
  }
}

.action-list {
  background: #fff;
  border-radius: 16rpx;
  margin-bottom: 60rpx;
  
  .action-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 30rpx;
    
    &:not(:last-child) {
      border-bottom: 1rpx solid #eee;
    }
    
    text {
      font-size: 28rpx;
      color: #333;
      
      &.icon-arrow-right {
        color: #999;
      }
    }
  }
}

.copyright {
  text-align: center;
  
  text {
    font-size: 24rpx;
    color: #999;
    display: block;
    line-height: 1.8;
  }
}
</style> 