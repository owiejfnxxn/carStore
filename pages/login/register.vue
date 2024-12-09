<template>
  <view class="register-container">
    <view class="register-header">
      <text class="title">注册账号</text>
      <text class="subtitle">填写以下信息完成注册</text>
    </view>
    
    <view class="register-form">
      <!-- 手机号输入 -->
      <view class="form-item">
        <text class="iconfont icon-phone"></text>
        <input 
          type="number"
          v-model="form.phone"
          placeholder="请输入手机号"
          maxlength="11"
          placeholder-class="placeholder"
        />
      </view>
      
      <!-- 验证码 -->
      <view class="form-item">
        <text class="iconfont icon-verify"></text>
        <input 
          type="number"
          v-model="form.code"
          placeholder="请输入验证码"
          maxlength="6"
          placeholder-class="placeholder"
        />
        <button 
          class="code-btn" 
          :disabled="counting"
          @tap="sendCode"
        >
          {{counting ? `${countdown}s后重试` : '获取验证码'}}
        </button>
      </view>
      
      <!-- 密码 -->
      <view class="form-item">
        <text class="iconfont icon-password"></text>
        <input 
          :type="showPassword ? 'text' : 'password'"
          v-model="form.password"
          placeholder="请设置登录密码"
          placeholder-class="placeholder"
        />
        <text 
          class="iconfont" 
          :class="showPassword ? 'icon-eye-open' : 'icon-eye-close'"
          @tap="togglePassword"
        ></text>
      </view>
      
      <!-- 确认密码 -->
      <view class="form-item">
        <text class="iconfont icon-password"></text>
        <input 
          :type="showConfirmPwd ? 'text' : 'password'"
          v-model="form.confirmPassword"
          placeholder="请确认登录密码"
          placeholder-class="placeholder"
        />
        <text 
          class="iconfont" 
          :class="showConfirmPwd ? 'icon-eye-open' : 'icon-eye-close'"
          @tap="toggleConfirmPwd"
        ></text>
      </view>
      
      <!-- 用户协议 -->
      <view class="agreement">
        <checkbox-group @change="handleAgreementChange">
          <label>
            <checkbox value="1" color="#007AFF"/>
            <text class="agreement-text">
              我已阅读并同意
              <text class="link" @tap.stop="showAgreement">《用户协议》</text>
              和
              <text class="link" @tap.stop="showPrivacy">《隐私政策》</text>
            </text>
          </label>
        </checkbox-group>
      </view>
      
      <button 
        class="register-btn" 
        :class="{ disabled: !isAgreed }"
        :disabled="!isAgreed"
        @tap="handleRegister"
      >注 册</button>
      
      <view class="login-link">
        已有账号？
        <text class="link" @tap="goToLogin">立即登录</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      form: {
        phone: '',
        code: '',
        password: '',
        confirmPassword: ''
      },
      showPassword: false,
      showConfirmPwd: false,
      isAgreed: false,
      counting: false,
      countdown: 60
    }
  },
  methods: {
    togglePassword() {
      this.showPassword = !this.showPassword
    },
    toggleConfirmPwd() {
      this.showConfirmPwd = !this.showConfirmPwd
    },
    handleAgreementChange(e) {
      this.isAgreed = e.detail.value.length > 0
    },
    startCountdown() {
      this.counting = true
      this.countdown = 60
      const timer = setInterval(() => {
        if (this.countdown > 0) {
          this.countdown--
        } else {
          this.counting = false
          clearInterval(timer)
        }
      }, 1000)
    },
    sendCode() {
      if (!/^1[3-9]\d{9}$/.test(this.form.phone)) {
        uni.showToast({
          title: '请输入正确的手机号',
          icon: 'none'
        })
        return
      }
      
      // 模拟发送验证码
      uni.showToast({
        title: '验证码已发送',
        icon: 'success'
      })
      this.startCountdown()
    },
    handleRegister() {
      if (!this.isAgreed) return
      
      if (!/^1[3-9]\d{9}$/.test(this.form.phone)) {
        uni.showToast({
          title: '请输入正确的手机号',
          icon: 'none'
        })
        return
      }
      
      if (!this.form.code) {
        uni.showToast({
          title: '请输入验证码',
          icon: 'none'
        })
        return
      }
      
      if (this.form.password.length < 6) {
        uni.showToast({
          title: '密码不能少于6位',
          icon: 'none'
        })
        return
      }
      
      if (this.form.password !== this.form.confirmPassword) {
        uni.showToast({
          title: '两次密码输入不一致',
          icon: 'none'
        })
        return
      }
      
      // 模拟注册
      uni.showLoading({
        title: '注册中...'
      })
      
      setTimeout(() => {
        uni.hideLoading()
        uni.showToast({
          title: '注册成功',
          icon: 'success'
        })
        setTimeout(() => {
          uni.navigateBack()
        }, 1500)
      }, 1500)
    },
    showAgreement() {
      // TODO: 显示用户协议
      uni.showToast({
        title: '用户协议',
        icon: 'none'
      })
    },
    showPrivacy() {
      // TODO: 显示隐私政策
      uni.showToast({
        title: '隐私政策',
        icon: 'none'
      })
    },
    goToLogin() {
      uni.navigateBack()
    }
  }
}
</script>

<style lang="scss" scoped>
.register-container {
  min-height: 100vh;
  background: #fff;
  padding: 0 40rpx;
}

.register-header {
  padding: 80rpx 0;
  
  .title {
    font-size: 48rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 20rpx;
    display: block;
  }
  
  .subtitle {
    font-size: 28rpx;
    color: #999;
  }
}

.register-form {
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
    }
    
    .code-btn {
      width: 200rpx;
      height: 60rpx;
      line-height: 60rpx;
      font-size: 24rpx;
      color: #007AFF;
      background: #f0f9ff;
      border-radius: 30rpx;
      padding: 0;
      
      &[disabled] {
        color: #999;
        background: #f5f5f5;
      }
    }
  }
}

.agreement {
  margin: 40rpx 0;
  
  label {
    display: flex;
    align-items: center;
  }
  
  .agreement-text {
    font-size: 26rpx;
    color: #666;
    margin-left: 10rpx;
    
    .link {
      color: #007AFF;
    }
  }
}

.register-btn {
  width: 100%;
  height: 90rpx;
  line-height: 90rpx;
  background: #007AFF;
  color: #fff;
  font-size: 32rpx;
  border-radius: 45rpx;
  margin: 40rpx 0;
  
  &.disabled {
    opacity: 0.5;
  }
  
  &:active {
    opacity: 0.8;
  }
}

.login-link {
  text-align: center;
  font-size: 26rpx;
  color: #666;
  
  .link {
    color: #007AFF;
    margin-left: 10rpx;
  }
}

.placeholder {
  color: #999;
  font-size: 28rpx;
}
</style> 