<template>
  <view class="login-container">
    <!-- 顶部Logo -->
    <view class="logo-section">
      <image class="logo" src='https://via.placeholder.com/80x80' mode="aspectFit"/>
      <text class="app-name">你很机车</text>
    </view>
    
    <!-- 登录表单 -->
    <view class="login-form">
      <view class="form-item">
        <text class="iconfont icon-user"></text>
        <input 
          type="text"
          v-model="form.username"
          placeholder="请输入用户名/手机号"
          placeholder-class="placeholder"
        />
      </view>
      
      <view class="form-item">
        <text class="iconfont icon-password"></text>
        <input 
          :type="showPassword ? 'text' : 'password'"
          v-model="form.password"
          placeholder="请输入密码"
          placeholder-class="placeholder"
        />
        <text 
          class="iconfont" 
          :class="showPassword ? 'icon-eye-open' : 'icon-eye-close'"
          @tap="togglePassword"
        ></text>
      </view>
      
      <view class="form-options">
        <label class="remember-pwd">
          <switch 
            :checked="rememberPassword" 
            @change="handleRememberChange" 
            color="#007AFF"
          />
          <text>记住密码</text>
        </label>
        <text class="forget-pwd" @tap="handleForgetPassword">忘记密码？</text>
      </view>
      
      <button class="login-btn" @tap="handleLogin">登 录</button>
      
      <view class="register-link">
        还没有账号？
        <text class="link" @tap="goToRegister">立即注册</text>
      </view>
    </view>
    
    <!-- 其他登录方式 -->
    <view class="other-login">
      <view class="divider">
        <text>其他登录方式</text>
      </view>
      
      <view class="login-methods">
        <view class="method-item" @tap="handleOtherLogin('wechat')">
          <text class="iconfont icon-wechat"></text>
          <text>微信</text>
        </view>
        <view class="method-item" @tap="handleOtherLogin('alipay')">
          <text class="iconfont icon-alipay"></text>
          <text>支付宝</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      form: {
        username: '',
        password: ''
      },
      showPassword: false,
      rememberPassword: false
    }
  },
  onLoad() {
    // 检查是否有保存的登录信息
    const userInfo = uni.getStorageSync('userInfo')
    if (userInfo && this.rememberPassword) {
      this.form.username = userInfo.username
      this.form.password = userInfo.password
    }
  },
  methods: {
    togglePassword() {
      this.showPassword = !this.showPassword
    },
    handleRememberChange(e) {
      this.rememberPassword = e.detail.value
      // 如果取消记住密码，清除存储的密码
      if (!this.rememberPassword) {
        const userInfo = uni.getStorageSync('userInfo')
        if (userInfo) {
          userInfo.password = ''
          uni.setStorageSync('userInfo', userInfo)
        }
      }
    },
    handleLogin() {
      if (!this.form.username || !this.form.password) {
        uni.showToast({
          title: '请输入用户名和密码',
          icon: 'none'
        })
        return
      }
      
      uni.showLoading({
        title: '登录中...'
      })
      
      // 模拟登录验证
      const mockUsers = [{
        username: 'admin',
        password: '123456'
      }, {
        username: 'test',
        password: '123456'
      }]
      
      const user = mockUsers.find(u => 
        u.username === this.form.username && 
        u.password === this.form.password
      )
      
      setTimeout(() => {
        uni.hideLoading()
        
        if (user) {
          // 保存登录状态和用户信息
          const userInfo = {
            isLogin: true,
            username: user.username,
            password: this.rememberPassword ? user.password : ''
          }
          uni.setStorageSync('userInfo', userInfo)
          uni.setStorageSync('isLoggedIn', true)
          
          uni.showToast({
            title: '登录成功',
            icon: 'success'
          })
          
          // 发送登录成功事件
          uni.$emit('loginSuccess', userInfo)
          
          setTimeout(() => {
            uni.navigateBack()
          }, 1500)
        } else {
          uni.showToast({
            title: '用户名或密码错误',
            icon: 'none'
          })
        }
      }, 1000)
    },
    handleForgetPassword() {
      uni.showToast({
        title: '暂未开放，请联系客服',
        icon: 'none'
      })
    },
    goToRegister() {
      uni.navigateTo({
        url: '/pages/login/register'
      })
    },
    handleOtherLogin(type) {
      uni.showToast({
        title: `${type}登录功能暂未开放`,
        icon: 'none'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.login-container {
  min-height: 100vh;
  background: #fff;
  padding: 0 40rpx;
  display: flex;
  flex-direction: column;
}

.logo-section {
  padding: 160rpx 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  
  .logo {
    width: 200rpx;
    height: 200rpx;
    margin-bottom: 20rpx;
  }
  
  .app-name {
    font-size: 48rpx;
    font-weight: bold;
    color: #333;
  }
}

.login-form {
  flex: 1;
  padding-top: 60rpx;

  .form-item {
    display: flex;
    align-items: center;
    height: 100rpx;
    border-bottom: 1rpx solid #eee;
    margin-bottom: 20rpx;
    
    .iconfont {
      font-size: 40rpx;
      color: #999;
      margin-right: 20rpx;
    }
    
    input {
      flex: 1;
      font-size: 28rpx;
      height: 100%;
    }
  }
  
  .form-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 40rpx 0;
    
    .remember-pwd {
      display: flex;
      align-items: center;
      font-size: 26rpx;
      color: #666;
      
      switch {
        transform: scale(0.7);
        margin-right: -10rpx;
      }
    }
    
    .forget-pwd {
      font-size: 26rpx;
      color: #007AFF;
      padding: 10rpx;
    }
  }
  
  .login-btn {
    width: 100%;
    height: 90rpx;
    line-height: 90rpx;
    background: #007AFF;
    color: #fff;
    font-size: 32rpx;
    border-radius: 45rpx;
    margin: 60rpx 0;
    
    &:active {
      opacity: 0.8;
    }
  }
  
  .register-link {
    text-align: center;
    font-size: 26rpx;
    color: #666;
    
    .link {
      color: #007AFF;
      margin-left: 10rpx;
      padding: 10rpx;
    }
  }
}

.other-login {
  margin-top: auto;
  padding-bottom: 60rpx;
  
  .divider {
    position: relative;
    text-align: center;
    margin-bottom: 60rpx;
    
    &::before,
    &::after {
      content: '';
      position: absolute;
      top: 50%;
      width: 30%;
      height: 1rpx;
      background: #eee;
    }
    
    &::before {
      left: 0;
    }
    
    &::after {
      right: 0;
    }
    
    text {
      display: inline-block;
      padding: 0 30rpx;
      font-size: 26rpx;
      color: #999;
      background: #fff;
    }
  }
  
  .login-methods {
    display: flex;
    justify-content: center;
    
    .method-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 0 60rpx;
      
      .iconfont {
        font-size: 88rpx;
        margin-bottom: 10rpx;
        
        &.icon-wechat {
          color: #07c160;
        }
        
        &.icon-alipay {
          color: #1677ff;
        }
      }
      
      text {
        font-size: 24rpx;
        color: #666;
      }
    }
  }
}

.placeholder {
  color: #999;
  font-size: 28rpx;
}
</style> 