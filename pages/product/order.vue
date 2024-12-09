<template>
  <view class="order-container">
    <!-- 商品信息 -->
    <view class="product-info">
      <image class="product-image" :src="productInfo.image" mode="aspectFill"/>
      <view class="info-content">
        <text class="product-name">{{productInfo.name}}</text>
        <text class="product-price">¥{{productInfo.price}}</text>
      </view>
    </view>
    
    <!-- 颜色选择 -->
    <view class="option-section">
      <text class="option-title">颜色选择</text>
      <view class="color-list">
        <view 
          class="color-item" 
          v-for="(color, index) in colors" 
          :key="index"
          :class="{ active: selectedColor === color.name }"
          @tap="selectColor(color.name)"
        >
          <view class="color-preview" :style="{ background: color.value }"></view>
          <text>{{color.name}}</text>
        </view>
      </view>
    </view>
    
    <!-- 配置选择 -->
    <view class="option-section">
      <text class="option-title">配置选择</text>
      <view class="config-list">
        <view 
          class="config-item"
          v-for="(config, index) in configs"
          :key="index"
          :class="{ active: selectedConfig === config.name }"
          @tap="selectConfig(config.name)"
        >
          <text>{{config.name}}</text>
          <text class="price">+¥{{config.price}}</text>
        </view>
      </view>
    </view>
    
    <!-- 预定方式 -->
    <view class="option-section">
      <text class="option-title">预定方式</text>
      <view class="deposit-info">
        <text class="deposit-amount">定金：¥{{deposit}}</text>
        <text class="deposit-desc">支付定金后锁定订单，余款提车时支付</text>
      </view>
    </view>
    
    <!-- 提车人信息 -->
    <view class="buyer-info">
      <view class="form-item">
        <text class="label required">您的称呼</text>
        <input 
          v-model="formData.name" 
          placeholder="请输入姓名"
          :class="{ error: showErrors && !formData.name }"
        />
        <text class="error-tip" v-if="showErrors && !formData.name">请输入您的称呼</text>
      </view>
      
      <view class="form-item">
        <text class="label required">身份证号</text>
        <input 
          v-model="formData.idCard" 
          placeholder="请输入身份证号"
          :class="{ error: showErrors && !isValidIdCard }"
        />
        <text class="error-tip" v-if="showErrors && !formData.idCard">请输入身份证号</text>
        <text class="error-tip" v-if="showErrors && formData.idCard && !isValidIdCard">请输入正确的身份证号</text>
      </view>
      
      <view class="form-item">
        <text class="label required">提车城市</text>
        <picker 
          @change="handleCityChange" 
          :value="cityIndex" 
          :range="cities"
          :class="{ error: showErrors && cityIndex < 0 }"
        >
          <view class="picker">{{cities[cityIndex] || '请选择城市'}}</view>
        </picker>
        <text class="error-tip" v-if="showErrors && cityIndex < 0">请选择提车城市</text>
      </view>
      
      <view class="form-item">
        <text class="label required">提车门店</text>
        <picker 
          @change="handleStoreChange" 
          :value="storeIndex" 
          :range="currentStores"
          :disabled="cityIndex < 0"
          :class="{ error: showErrors && cityIndex >= 0 && storeIndex < 0 }"
        >
          <view class="picker">{{currentStores[storeIndex] || '请选择门店'}}</view>
        </picker>
        <text class="error-tip" v-if="showErrors && cityIndex >= 0 && storeIndex < 0">请选择提车门店</text>
      </view>
      
      <view class="form-item">
        <text class="label required">联系方式</text>
        <input 
          v-model="formData.phone" 
          type="number" 
          maxlength="11"
          placeholder="请输入手机号"
          :class="{ error: showErrors && !isValidPhone }"
        />
        <text class="error-tip" v-if="showErrors && !formData.phone">请输入联系方式</text>
        <text class="error-tip" v-if="showErrors && formData.phone && !isValidPhone">请输入正确的手机号</text>
      </view>
    </view>
    
    <!-- 购车须知 -->
    <view class="agreement">
      <checkbox-group @change="handleAgreementChange">
        <checkbox :checked="isAgreed" color="#007AFF"/>
        <text>我已阅读并同意</text>
        <text class="link" @tap="showAgreement">《购车须知》</text>
      </checkbox-group>
    </view>
    
    <!-- 提交按钮 -->
    <view class="submit-section">
      <view class="price-info">
        <text>定金：</text>
        <text class="price">¥{{deposit}}</text>
      </view>
      <button 
        class="submit-btn" 
        :disabled="!canSubmit"
        @tap="submitOrder"
      >
        提交订单
      </button>
    </view>
    
    <!-- 购车须知弹窗 -->
    <view class="popup-mask" v-if="showAgreementPopup" @tap="closeAgreement">
      <view class="popup-content" @tap.stop>
        <view class="agreement-content">
          <text class="close-icon" @tap="closeAgreement">×</text>
          <view class="agreement-title">购车须知</view>
          <scroll-view scroll-y class="agreement-text">
            <text>{{agreementText}}</text>
          </scroll-view>
          <button class="close-btn" @tap="closeAgreement">关闭</button>
        </view>
      </view>
    </view>
  </view>
</template> 

<script>
export default {
  data() {
    return {
      productInfo: {
        image: '',
        name: '',
        price: ''
      },
      // 颜色选项
      colors: [
        { name: '曜石黑', value: '#000000' },
        { name: '珍珠白', value: '#FFFFFF' },
        { name: '赛道红', value: '#FF0000' }
      ],
      selectedColor: '',
      
      // 配置选项
      configs: [
        { name: '标准版', price: '0' },
        { name: '运动版', price: '2000' },
        { name: '豪华版', price: '5000' }
      ],
      selectedConfig: '',
      
      // 定金
      deposit: '5000',
      
      // 表单数据
      formData: {
        name: '',
        idCard: '',
        phone: ''
      },
      
      // 城市和门店
      cities: ['北京', '上海', '广州', '深圳'],
      cityIndex: -1,
      storeIndex: -1,
      storeMap: {
        '北京': ['朝阳店', '海淀店', '丰台店'],
        '上海': ['浦东店', '静安店', '徐汇店'],
        '广州': ['天河店', '越秀店', '海珠店'],
        '深圳': ['南山店', '福田店', '罗湖店']
      },
      
      isAgreed: false,
      showErrors: false,
      
      // 购车须知
      agreementText: `
        1. 订购流程说明
        - 支付定金后订单生效
        - 定金不可退
        - 提车时需支付全款
        
        2. 所需材料
        - 身份证原件
        - 驾驶证
        - 购车款项
        
        3. 保修政策
        - 整车保修2年
        - 发动机核心部件保修3年
        
        4. 其他说明
        - 具体配置以实车为准
        - 提车时间可能因各种因素产生变动
        - 本公司保留最终解释权
      `,
      showAgreementPopup: false
    }
  },
  
  computed: {
    currentStores() {
      return this.cityIndex >= 0 ? this.storeMap[this.cities[this.cityIndex]] : []
    },
    
    isValidPhone() {
      return /^1[3-9]\d{9}$/.test(this.formData.phone)
    },
    
    isValidIdCard() {
      return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(this.formData.idCard)
    },
    
    canSubmit() {
      return this.formData.name && 
        this.isValidIdCard && 
        this.cityIndex >= 0 && 
        this.storeIndex >= 0 && 
        this.isValidPhone && 
        this.selectedColor && 
        this.selectedConfig && 
        this.isAgreed
    }
  },
  
  onLoad(options) {
    // 获取商品信息
    if (options.id) {
      // 这应该根据id获取商品信息
      this.productInfo = {
        image: 'https://via.placeholder.com/300x200',
        name: '2024款 春风NK400',
        price: '68800'
      }
    }
  },
  
  methods: {
    selectColor(color) {
      this.selectedColor = color
    },
    
    selectConfig(config) {
      this.selectedConfig = config
    },
    
    handleCityChange(e) {
      this.cityIndex = e.detail.value
      this.storeIndex = -1
    },
    
    handleStoreChange(e) {
      this.storeIndex = e.detail.value
    },
    
    handleAgreementChange(e) {
      this.isAgreed = e.detail.value.length > 0
    },
    
    showAgreement() {
      this.showAgreementPopup = true
    },
    
    closeAgreement() {
      this.showAgreementPopup = false
    },
    
    handlePopupChange(e) {
      this.showAgreementPopup = e.show
    },
    
    validateForm() {
      this.showErrors = true
      
      if (!this.formData.name) return false
      if (!this.isValidIdCard) return false
      if (this.cityIndex < 0) return false
      if (this.storeIndex < 0) return false
      if (!this.isValidPhone) return false
      if (!this.selectedColor) return false
      if (!this.selectedConfig) return false
      if (!this.isAgreed) return false
      
      return true
    },
    
    submitOrder() {
      if (!this.validateForm()) return
      uni.showLoading({ title: '提交中...' })
      
      // 模拟提交
      setTimeout(() => {
        uni.hideLoading()
        uni.showToast({
          title: '订单提交成功',
          icon: 'success'
        })
        
        setTimeout(() => {
          uni.redirectTo({
            url: `/pages/order/detail?id=${Date.now()}`
          })
        }, 1500)
      }, 1500)
    }
  }
}
</script> 

<style lang="scss" scoped>
.order-container {
  min-height: 100vh;
  background: #f8f9fa;
  padding-bottom: 180rpx;
}

// 商品信息卡片
.product-info {
  margin: 20rpx;
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  display: flex;
  align-items: center;
  box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.03);
  
  .product-image {
    width: 180rpx;
    height: 180rpx;
    border-radius: 12rpx;
    margin-right: 20rpx;
    background: #f5f5f5;
  }
  
  .info-content {
    flex: 1;
    
    .product-name {
      font-size: 32rpx;
      color: #333;
      font-weight: 600;
      margin-bottom: 16rpx;
      display: block;
    }
    
    .product-price {
      font-size: 36rpx;
      color: #ff4d4f;
      font-weight: bold;
    }
  }
}

// 选项区域
.option-section {
  margin: 20rpx;
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.03);
  
  .option-title {
    font-size: 28rpx;
    color: #333;
    font-weight: 600;
    margin-bottom: 24rpx;
    display: block;
  }
  
  // 颜色选择
  .color-list {
    display: flex;
    flex-wrap: wrap;
    gap: 24rpx;
    
    .color-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      
      .color-preview {
        width: 60rpx;
        height: 60rpx;
        border-radius: 30rpx;
        border: 2rpx solid #eee;
        margin-bottom: 12rpx;
        transition: all 0.3s ease;
      }
      
      text {
        font-size: 24rpx;
        color: #666;
      }
      
      &.active {
        .color-preview {
          transform: scale(1.1);
          border: 4rpx solid #007AFF;
        }
        
        text {
          color: #007AFF;
          font-weight: 500;
        }
      }
    }
  }
  
  // 配置选择
  .config-list {
    .config-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 88rpx;
      padding: 0 24rpx;
      background: #f8f9fa;
      border-radius: 12rpx;
      margin-bottom: 16rpx;
      transition: all 0.3s ease;
      
      text {
        font-size: 28rpx;
        color: #333;
        
        &.price {
          color: #ff4d4f;
        }
      }
      
      &.active {
        background: #e6f7ff;
        border: 2rpx solid #007AFF;
        
        text {
          color: #007AFF;
          font-weight: 500;
          
          &.price {
            color: #007AFF;
          }
        }
      }
    }
  }
  
  // 定金信息
  .deposit-info {
    background: #fff7e6;
    padding: 24rpx;
    border-radius: 12rpx;
    
    .deposit-amount {
      font-size: 32rpx;
      color: #ff4d4f;
      font-weight: bold;
      margin-bottom: 12rpx;
      display: block;
    }
    
    .deposit-desc {
      font-size: 24rpx;
      color: #666;
    }
  }
}

// 提车人信息
.buyer-info {
  margin: 20rpx;
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.03);
  
  .form-item {
    margin-bottom: 24rpx;
    
    .label {
      font-size: 28rpx;
      color: #333;
      margin-bottom: 12rpx;
      display: block;
      font-weight: 500;
      
      &.required::before {
        content: '*';
        color: #ff4d4f;
        margin-right: 4rpx;
      }
    }
    
    input,
    .picker {
      width: 100%;
      height: 88rpx;
      line-height: 88rpx;
      background: #f8f9fa;
      border-radius: 12rpx;
      padding: 0 24rpx;
      font-size: 28rpx;
      color: #333;
      transition: all 0.3s ease;
      
      &:focus {
        background: #fff;
        box-shadow: 0 0 0 2rpx rgba(0,122,255,0.2);
      }
      
      &[disabled] {
        color: #999;
        background: #f5f5f5;
      }
      
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

// 购车须知
.agreement {
  margin: 20rpx;
  padding: 24rpx 0;
  display: flex;
  align-items: center;
  justify-content: center;
  
  checkbox-group {
    display: flex;
    align-items: center;
    
    checkbox {
      transform: scale(0.8);
      margin-right: 8rpx;
    }
    
    text {
      font-size: 26rpx;
      color: #666;
    }
    
    .link {
      color: #007AFF;
      padding: 4rpx 8rpx;
    }
  }
}

// 底部提交区域
.submit-section {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff;
  padding: 24rpx 30rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 -2rpx 20rpx rgba(0,0,0,0.05);
  
  .price-info {
    text {
      font-size: 28rpx;
      color: #666;
      
      &.price {
        font-size: 40rpx;
        color: #ff4d4f;
        font-weight: bold;
      }
    }
  }
  
  .submit-btn {
    width: 280rpx;
    height: 88rpx;
    line-height: 88rpx;
    background: linear-gradient(135deg, #007AFF, #1989fa);
    color: #fff;
    font-size: 32rpx;
    border-radius: 44rpx;
    font-weight: 500;
    box-shadow: 0 4rpx 12rpx rgba(0,122,255,0.3);
    transition: all 0.3s ease;
    
    &:active {
      transform: scale(0.98);
      box-shadow: 0 2rpx 8rpx rgba(0,122,255,0.2);
    }
    
    &[disabled] {
      background: #ccc;
      box-shadow: none;
    }
  }
}

// 购车须知弹窗
.popup-mask {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.3s ease;
}

.popup-content {
  animation: scaleIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes scaleIn {
  from {
    transform: scale(0.8);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.agreement-content {
  width: 600rpx;
  background: #fff;
  border-radius: 20rpx;
  padding: 40rpx;
  position: relative;
  
  .agreement-title {
    font-size: 32rpx;
    font-weight: 600;
    color: #333;
    text-align: center;
    margin-bottom: 30rpx;
    padding: 0 60rpx;
  }
  
  .close-icon {
    position: absolute;
    right: 20rpx;
    top: 20rpx;
    width: 40rpx;
    height: 40rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #999;
    font-size: 40rpx;
    z-index: 1;
    
    &:active {
      opacity: 0.7;
    }
  }
  
  .agreement-text {
    height: 600rpx;
    font-size: 28rpx;
    color: #666;
    line-height: 1.6;
    padding: 20rpx;
    background: #f8f9fa;
    border-radius: 12rpx;
  }
  
  .close-btn {
    width: 100%;
    height: 88rpx;
    line-height: 88rpx;
    background: #f5f5f5;
    color: #666;
    font-size: 28rpx;
    border-radius: 44rpx;
    margin-top: 30rpx;
    
    &:active {
      background: #eee;
    }
  }
}
</style> 