<template>
  <view class="refund-container">
    <!-- 订单信息 -->
    <view class="order-info">
      <image :src="orderInfo.productImage" mode="aspectFill"/>
      <view class="info-content">
        <text class="product-name">{{orderInfo.productName}}</text>
        <text class="deposit">定金：¥{{orderInfo.deposit}}</text>
      </view>
    </view>
    
    <!-- 退款表单 -->
    <view class="form-section">
      <view class="form-item">
        <text class="label required">退款金额</text>
        <text class="amount">¥{{orderInfo.deposit}}</text>
        <text class="tip">定金将原路退回支付账户</text>
      </view>
      
      <view class="form-item">
        <text class="label required">退款原因</text>
        <picker 
          @change="handleReasonChange" 
          :value="reasonIndex" 
          :range="refundReasons"
          :class="{ error: showErrors && reasonIndex < 0 }"
        >
          <view class="picker">{{refundReasons[reasonIndex] || '请选择退款原因'}}</view>
        </picker>
        <text class="error-tip" v-if="showErrors && reasonIndex < 0">请选择退款原因</text>
      </view>
      
      <view class="form-item">
        <text class="label">退款说明</text>
        <textarea 
          v-model="refundDesc"
          placeholder="请输入退款说明（选填）"
          maxlength="200"
        />
        <text class="word-count">{{refundDesc.length}}/200</text>
      </view>
      
      <!-- 上传凭证 -->
      <view class="form-item">
        <text class="label">上传凭证</text>
        <view class="upload-list">
          <view 
            class="image-item" 
            v-for="(img, index) in images" 
            :key="index"
          >
            <image :src="img" mode="aspectFill"/>
            <text class="delete-btn" @tap="deleteImage(index)">×</text>
          </view>
          <view 
            class="upload-btn"
            v-if="images.length < 3"
            @tap="chooseImage"
          >
            <text class="iconfont icon-add">+</text>
            <text class="tip">{{images.length}}/3</text>
          </view>
        </view>
        <text class="upload-tip">最多上传3张图片</text>
      </view>
    </view>
    
    <!-- 提交按钮 -->
    <view class="submit-section">
      <button 
        class="submit-btn" 
        :disabled="!canSubmit || isSubmitting"
        @tap="submitRefund"
      >
        {{ isSubmitting ? '提交中...' : '提交申请' }}
      </button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      orderNo: '',
      orderInfo: {
        productImage: 'https://via.placeholder.com/200x200',
        productName: '2024款 春风NK400',
        deposit: '5000'
      },
      refundReasons: [
        '计划有变',
        '无法按时提车',
        '重新选择车型',
        '其他原因'
      ],
      reasonIndex: -1,
      refundDesc: '',
      images: [],
      showErrors: false,
      isSubmitting: false
    }
  },
  
  computed: {
    canSubmit() {
      return this.reasonIndex >= 0
    }
  },
  
  onLoad(options) {
    if (options.orderNo) {
      this.orderNo = options.orderNo
      // 这里应该根据订单号获取订单信息
    }
  },
  
  methods: {
    handleReasonChange(e) {
      this.reasonIndex = e.detail.value
    },
    
    chooseImage() {
      uni.chooseImage({
        count: 3 - this.images.length,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          this.images = [...this.images, ...res.tempFilePaths]
        }
      })
    },
    
    deleteImage(index) {
      this.images.splice(index, 1)
    },
    
    validateForm() {
      this.showErrors = true
      return this.reasonIndex >= 0
    },
    
    submitRefund() {
      if (!this.validateForm()) return
      if (this.isSubmitting) return
      
      this.isSubmitting = true
      uni.showLoading({ title: '提交中...' })
      
      // 模拟提交
      setTimeout(() => {
        uni.hideLoading()
        this.isSubmitting = false
        
        uni.showToast({
          title: '申请已提交',
          icon: 'success'
        })
        
        setTimeout(() => {
          uni.navigateBack({
            delta: 2 // 返回到订单列表页
          })
        }, 1500)
      }, 1500)
    }
  }
}
</script>

<style lang="scss" scoped>
.refund-container {
  min-height: 100vh;
  background: #f8f9fa;
  padding-bottom: 120rpx;
}

.order-info {
  background: #fff;
  padding: 30rpx;
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
  
  image {
    width: 120rpx;
    height: 120rpx;
    border-radius: 12rpx;
    margin-right: 20rpx;
  }
  
  .info-content {
    flex: 1;
    
    .product-name {
      font-size: 28rpx;
      color: #333;
      margin-bottom: 12rpx;
      display: block;
    }
    
    .deposit {
      font-size: 32rpx;
      color: #ff4d4f;
      font-weight: 500;
    }
  }
}

.form-section {
  background: #fff;
  padding: 30rpx;
  
  .form-item {
    margin-bottom: 30rpx;
    position: relative;
    
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
    
    .amount {
      font-size: 40rpx;
      color: #ff4d4f;
      font-weight: bold;
      display: block;
      margin-bottom: 8rpx;
    }
    
    .tip {
      font-size: 24rpx;
      color: #999;
    }
    
    .picker {
      height: 88rpx;
      line-height: 88rpx;
      background: #f5f5f5;
      border-radius: 12rpx;
      padding: 0 24rpx;
      font-size: 28rpx;
      color: #333;
      
      &.error {
        background: #fff2f0;
        border: 2rpx solid #ff4d4f;
      }
    }
    
    textarea {
      width: 100%;
      height: 200rpx;
      background: #f5f5f5;
      border-radius: 12rpx;
      padding: 24rpx;
      font-size: 28rpx;
      color: #333;
    }
    
    .word-count {
      position: absolute;
      right: 24rpx;
      bottom: 24rpx;
      font-size: 24rpx;
      color: #999;
    }
    
    .error-tip {
      font-size: 24rpx;
      color: #ff4d4f;
      margin-top: 8rpx;
    }
  }
}

.upload-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20rpx;
  margin-top: 20rpx;
  
  .image-item,
  .upload-btn {
    position: relative;
    padding-bottom: 100%;
    background: #f5f5f5;
    border-radius: 12rpx;
    overflow: hidden;
  }
  
  .image-item {
    image {
      position: absolute;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .delete-btn {
      position: absolute;
      right: 10rpx;
      top: 10rpx;
      width: 40rpx;
      height: 40rpx;
      line-height: 40rpx;
      text-align: center;
      background: rgba(0,0,0,0.5);
      color: #fff;
      border-radius: 50%;
      font-size: 32rpx;
    }
  }
  
  .upload-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    
    .icon-add {
      font-size: 60rpx;
      color: #999;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    
    .tip {
      font-size: 24rpx;
      color: #999;
      position: absolute;
      bottom: 20rpx;
      left: 50%;
      transform: translateX(-50%);
    }
  }
}

.upload-tip {
  font-size: 24rpx;
  color: #999;
  margin-top: 12rpx;
  display: block;
}

.submit-section {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff;
  padding: 20rpx 30rpx;
  box-shadow: 0 -2rpx 20rpx rgba(0,0,0,0.05);
  
  .submit-btn {
    width: 100%;
    height: 88rpx;
    line-height: 88rpx;
    background: linear-gradient(135deg, #007AFF, #1989fa);
    color: #fff;
    font-size: 32rpx;
    border-radius: 44rpx;
    
    &[disabled] {
      background: #ccc;
    }
  }
}
</style> 