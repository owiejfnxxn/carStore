<template>
  <view class="profile-container">
    <!-- 头像区域 -->
    <view class="avatar-section">
      <view class="avatar-wrapper">
        <image :src="userInfo.avatar" mode="aspectFill"/>
        <view class="edit-mask" @tap="changeAvatar">
          <text class="iconfont icon-camera"></text>
        </view>
      </view>
      <text class="tip">点击更换头像</text>
    </view>
    
    <!-- 表单区域 -->
    <view class="form-section">
      <view class="form-item">
        <text class="label required">用户名</text>
        <input 
          v-model="userInfo.username"
          placeholder="请输入用户名"
          :class="{ error: showErrors && !userInfo.username }"
        />
        <text class="error-tip" v-if="showErrors && !userInfo.username">请输入用户名</text>
      </view>
      
      <view class="form-item">
        <text class="label required">您的称呼</text>
        <input 
          v-model="userInfo.realName"
          placeholder="请输入上牌人姓名"
          :class="{ error: showErrors && !userInfo.realName }"
        />
        <text class="error-tip" v-if="showErrors && !userInfo.realName">请输入您的称呼</text>
      </view>
      
      <view class="form-item">
        <text class="label required">身份证号</text>
        <input 
          v-model="userInfo.idCard"
          placeholder="请输入上牌人身份证号"
          :class="{ error: showErrors && !isValidIdCard }"
        />
        <text class="error-tip" v-if="showErrors && !userInfo.idCard">请输入身份证号</text>
        <text class="error-tip" v-if="showErrors && userInfo.idCard && !isValidIdCard">请输入正确的身份证号</text>
      </view>
      
      <view class="form-item">
        <text class="label required">联系方式</text>
        <input 
          v-model="userInfo.phone"
          type="number"
          maxlength="11"
          placeholder="请输入手机号"
          :class="{ error: showErrors && !isValidPhone }"
        />
        <text class="error-tip" v-if="showErrors && !userInfo.phone">请输入联系方式</text>
        <text class="error-tip" v-if="showErrors && userInfo.phone && !isValidPhone">请输入正确的手机号</text>
      </view>
    </view>
    
    <!-- 保存按钮 -->
    <button class="save-btn" @tap="saveProfile">保存</button>
  </view>
</template>

<script>
export default {
  data() {
    return {
      userInfo: {
        avatar: 'https://via.placeholder.com/80x80',
        username: '',
        realName: '',
        idCard: '',
        phone: ''
      },
      showErrors: false
    }
  },
  
  computed: {
    isValidPhone() {
      return /^1[3-9]\d{9}$/.test(this.userInfo.phone)
    },
    
    isValidIdCard() {
      return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(this.userInfo.idCard)
    }
  },
  
  onLoad() {
    // 获取已有的用户信息
    const savedInfo = uni.getStorageSync('userInfo')
    if (savedInfo) {
      this.userInfo = {
        ...this.userInfo,
        ...savedInfo
      }
    }
  },
  
  methods: {
    changeAvatar() {
      uni.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          this.userInfo.avatar = res.tempFilePaths[0]
        }
      })
    },
    
    validateForm() {
      this.showErrors = true
      
      if (!this.userInfo.username) return false
      if (!this.userInfo.realName) return false
      if (!this.isValidIdCard) return false
      if (!this.isValidPhone) return false
      
      return true
    },
    
    saveProfile() {
      if (!this.validateForm()) return
      
      uni.showLoading({ title: '保存中...' })
      
      // 保存用户信息
      uni.setStorageSync('userInfo', this.userInfo)
      
      setTimeout(() => {
        uni.hideLoading()
        uni.showToast({
          title: '保存成功',
          icon: 'success'
        })
        
        // 通知个人中心页面更新信息
        uni.$emit('updateUserInfo', this.userInfo)
        
        setTimeout(() => {
          uni.navigateBack()
        }, 1500)
      }, 1000)
    }
  }
}
</script>

<style lang="scss" scoped>
.profile-container {
  min-height: 100vh;
  background: #f8f9fa;
  padding: 30rpx;
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 40rpx 0;
  
  .avatar-wrapper {
    position: relative;
    width: 160rpx;
    height: 160rpx;
    border-radius: 80rpx;
    margin-bottom: 20rpx;
    overflow: hidden;
    
    image {
      width: 100%;
      height: 100%;
    }
    
    .edit-mask {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 60rpx;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      
      .iconfont {
        color: #fff;
        font-size: 32rpx;
      }
    }
  }
  
  .tip {
    font-size: 24rpx;
    color: #999;
  }
}

.form-section {
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 40rpx;
  
  .form-item {
    margin-bottom: 30rpx;
    
    &:last-child {
      margin-bottom: 0;
    }
    
    .label {
      font-size: 28rpx;
      color: #333;
      margin-bottom: 12rpx;
      display: block;
      
      &.required::before {
        content: '*';
        color: #ff4d4f;
        margin-right: 4rpx;
      }
    }
    
    input {
      width: 100%;
      height: 88rpx;
      background: #f8f9fa;
      border-radius: 12rpx;
      padding: 0 24rpx;
      font-size: 28rpx;
      color: #333;
      
      &.error {
        background: #fff2f0;
        border: 2rpx solid #ff4d4f;
      }
    }
    
    .error-tip {
      font-size: 24rpx;
      color: #ff4d4f;
      margin-top: 8rpx;
    }
  }
}

.save-btn {
  width: 100%;
  height: 88rpx;
  line-height: 88rpx;
  background: linear-gradient(135deg, #007AFF, #1989fa);
  color: #fff;
  font-size: 32rpx;
  border-radius: 44rpx;
  font-weight: 500;
  box-shadow: 0 4rpx 12rpx rgba(0,122,255,0.3);
  
  &:active {
    transform: scale(0.98);
    box-shadow: 0 2rpx 8rpx rgba(0,122,255,0.2);
  }
}
</style> 