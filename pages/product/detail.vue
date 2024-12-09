<template>
  <view class="detail-container">
    <!-- 商品轮播图 -->
    <swiper class="product-swiper" circular autoplay interval="3000" duration="500">
      <swiper-item v-for="(item, index) in productInfo.images" :key="index">
        <image :src="item" mode="aspectFill"/>
      </swiper-item>
    </swiper>
    
    <!-- 商品信息 -->
    <view class="product-info">
      <view class="price-section">
        <text class="price">¥{{productInfo.price}}</text>
        <text class="original-price">¥{{productInfo.originalPrice}}</text>
        <text class="sales">已售 {{productInfo.sales}}+</text>
      </view>
      
      <view class="title-section">
        <text class="title">{{productInfo.title}}</text>
        <button class="share-btn" @tap="handleShare">
          <text class="iconfont icon-share"></text>
          分享
        </button>
      </view>
      
      <view class="tags">
        <text class="tag" v-for="(tag, index) in productInfo.tags" :key="index">{{tag}}</text>
      </view>
    </view>
    
    <!-- 商品参数 -->
    <view class="specs-section">
      <view class="section-title">机车参数</view>
      <view class="specs-list">
        <view class="spec-item" v-for="(spec, index) in productInfo.specs" :key="index">
          <text class="label">{{spec.label}}</text>
          <text class="value">{{spec.value}}</text>
        </view>
      </view>
    </view>
    
    <!-- 商品详情 -->
    <view class="detail-section">
      <view class="section-title">机车详情</view>
      <view class="detail-content">
        <view class="detail-item" v-for="(item, index) in productInfo.details" :key="index">
          <image :src="item.image" mode="widthFix" class="detail-image"/>
          <view class="detail-desc">{{item.desc}}</view>
        </view>
      </view>
    </view>
    
    <!-- 底部操作栏 -->
    <view class="action-bar">
      <view class="left-actions">
        <button class="test-drive-btn" @tap="showTestDrive">预约试驾</button>
      </view>
      <view class="right-actions">
        <button class="buy-btn" @tap="buyNow">立即订购</button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      productId: '',
      isFavorite: false,
      // 城市和门店数据
      cities: ['北京', '上海', '广州', '深圳'],
      cityIndex: -1,
      storeIndex: -1,
      storeMap: {
        '北京': ['朝阳店', '海淀店', '丰台店'],
        '上海': ['浦东店', '静安店', '徐汇店'],
        '广州': ['天河店', '越秀店', '海珠店'],
        '深圳': ['南山店', '福田店', '罗湖店']
      },
      
      // 商品详情
      productInfo: {
        images: [
          'https://via.placeholder.com/750x500',
          'https://via.placeholder.com/750x500',
          'https://via.placeholder.com/750x500'
        ],
        price: '68800',
        originalPrice: '72800',
        sales: 326,
        title: '2024款 春风NK400 街车摩托车',
        tags: ['摩托车', '街车', '春风'],
        specs: [
          { label: '品牌', value: '春风' },
          { label: '型号', value: 'NK400' },
          { label: '类型', value: '街车' },
          { label: '排量', value: '400cc' },
          { label: '发动机', value: '水冷四冲程' },
          { label: '最大功率', value: '32kW' },
          { label: '最大扭矩', value: '38Nm' },
          { label: '车重', value: '195kg' },
          { label: '油箱容量', value: '17L' },
          { label: '轮胎规格', value: '前120/70-17M/C 54H，后160/60-17M/C 66H' }
        ],
        details: [
          { image: 'https://via.placeholder.com/750x500', desc: '机车外观' },
          { image: 'https://via.placeholder.com/750x500', desc: '发动机细节' },
          { image: 'https://via.placeholder.com/750x500', desc: '骑行体验' }
        ]
      },
      showErrors: false,
      isSubmitting: false
    }
  },
  
  computed: {
    startDate() {
      const date = new Date()
      return date.toISOString().split('T')[0]
    },
    
    currentStores() {
      return this.cityIndex >= 0 ? this.storeMap[this.cities[this.cityIndex]] : []
    }
  },
  
  methods: {
    handleShare() {
      uni.showShareMenu({
        withShareTicket: true
      })
    },
    handleService() {
      uni.showToast({
        title: '正在接入客服...',
        icon: 'none'
      })
    },
    toggleFavorite() {
      this.isFavorite = !this.isFavorite
      uni.showToast({
        title: this.isFavorite ? '收成功' : '已取消收藏',
        icon: 'success'
      })
    },
    goToCart() {
      uni.switchTab({
        url: '/pages/cart/index'
      })
    },
    addToCart() {
      uni.showLoading({
        title: '正在加入...'
      })
      setTimeout(() => {
        uni.hideLoading()
        uni.showToast({
          title: '已加入购物车',
          icon: 'success'
        })
        this.cartCount++
      }, 1000)
    },
    buyNow() {
      // 检查是否登录
      const isLoggedIn = uni.getStorageSync('isLoggedIn')
      if (!isLoggedIn) {
        uni.showModal({
          title: '提示',
          content: '请先登录后再进行购买',
          success: (res) => {
            if (res.confirm) {
              uni.navigateTo({ url: '/pages/login/index' })
            }
          }
        })
        return
      }
      
      uni.navigateTo({
        url: `/pages/product/order?id=${this.productId}`
      })
    },
    
    // 预约试驾相关方法
    showTestDrive() {
      uni.navigateTo({
        url: `/pages/product/test-drive?id=${this.productId}`
      })
    },
    
    handleCityChange(e) {
      this.cityIndex = e.detail.value
      this.storeIndex = -1
    },
    
    handleStoreChange(e) {
      this.storeIndex = e.detail.value
    },
    
    handleDateChange(e) {
      this.testDriveForm.date = e.detail.value
    },
    
    closeTestDrive() {
      if (this.isSubmitting) return
      this.$refs.testDrivePopup.close()
    },
    
    submitTestDrive() {
      if (this.isSubmitting) return
      if (!this.validateTestDriveForm()) return
      
      this.isSubmitting = true
      uni.showLoading({ title: '提交中...' })
      
      // 模拟提交
      setTimeout(() => {
        uni.hideLoading()
        this.isSubmitting = false
        
        uni.showToast({
          title: '预约成功',
          icon: 'success'
        })
        
        this.$refs.testDrivePopup.close()
        
        // 重置表单
        this.resetTestDriveForm()
      }, 1500)
    },
    
    resetTestDriveForm() {
      this.testDriveForm = {
        name: '',
        phone: '',
        date: ''
      }
      this.cityIndex = -1
      this.storeIndex = -1
      this.showErrors = false
    },
    
    validateTestDriveForm() {
      this.showErrors = true
      
      if (!this.testDriveForm.name) return false
      if (this.cityIndex < 0) return false
      if (this.storeIndex < 0) return false
      if (!this.testDriveForm.date) return false
      if (!this.testDriveForm.phone) return false
      if (!this.isValidPhone) return false
      
      return true
    }
  }
}
</script>

<style lang="scss" scoped>
.detail-container {
  padding-bottom: 100rpx;
}

.product-swiper {
  width: 100%;
  height: 500rpx;
  
  image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .banner-box {
    width: 100%;
    height: 100%;
    background: #f5f5f5;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    
    .iconfont {
      font-size: 120rpx;
      color: #999;
      margin-bottom: 20rpx;
    }
    
    .banner-text {
      font-size: 28rpx;
      color: #999;
    }
  }
}

.product-info {
  background: #fff;
  padding: 30rpx;
  
  .price-section {
    margin-bottom: 20rpx;
    
    .price {
      font-size: 48rpx;
      color: #ff4d4f;
      font-weight: bold;
    }
    
    .original-price {
      font-size: 28rpx;
      color: #999;
      text-decoration: line-through;
      margin-left: 20rpx;
    }
    
    .sales {
      float: right;
      font-size: 24rpx;
      color: #999;
      margin-top: 20rpx;
    }
  }
  
  .title-section {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 20rpx;
    
    .title {
      flex: 1;
      font-size: 32rpx;
      font-weight: bold;
      color: #333;
      margin-right: 20rpx;
    }
    
    .share-btn {
      min-width: 120rpx;
      height: 60rpx;
      line-height: 60rpx;
      font-size: 24rpx;
      color: #666;
      background: #f5f5f5;
      border-radius: 30rpx;
      padding: 0 20rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      
      .iconfont {
        font-size: 28rpx;
        margin-right: 6rpx;
      }
    }
  }
  
  .tags {
    .tag {
      display: inline-block;
      padding: 4rpx 12rpx;
      margin-right: 10rpx;
      font-size: 24rpx;
      color: #ff4d4f;
      background: #fff1f0;
      border-radius: 4rpx;
    }
  }
}

.specs-section,
.detail-section {
  margin-top: 20rpx;
  background: #fff;
  padding: 30rpx;
  
  .section-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 30rpx;
  }
}

.specs-list {
  .spec-item {
    display: flex;
    margin-bottom: 20rpx;
    
    .label {
      width: 160rpx;
      font-size: 28rpx;
      color: #999;
    }
    
    .value {
      flex: 1;
      font-size: 28rpx;
      color: #333;
    }
  }
}

.detail-content {
  .detail-item {
    margin-bottom: 30rpx;
    
    .detail-image {
      width: 100%;
      height: 500rpx;
      background: #f5f5f5;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin-bottom: 20rpx;
      
      .iconfont {
        font-size: 100rpx;
        color: #999;
        margin-bottom: 20rpx;
      }
      
      .image-text {
        font-size: 28rpx;
        color: #999;
      }
    }
    
    .detail-desc {
      font-size: 28rpx;
      color: #666;
      line-height: 1.6;
    }
  }
}

.action-bar {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: 100rpx;
  height: 100rpx;
  display: flex;
  align-items: center;
  padding: 0 30rpx;
  border-radius: 50rpx;
  background: transparent;
  width: auto;
  z-index: 99;
  
  .left-actions {
    display: flex;
    button {
      width: 280rpx;
      height: 88rpx;
      line-height: 88rpx;
      font-size: 32rpx;
      margin-left: 40rpx;
      border-radius: 44rpx;
    }
  }
  
  .right-actions {
    display: flex;
    
    button {
      width: 280rpx;
      height: 88rpx;
      line-height: 88rpx;
      font-size: 32rpx;
      margin-left: 40rpx;
      border-radius: 44rpx;
    }
  }
}

.test-drive-btn {
  background: #fff;
  color: #007AFF;
  font-size: 32rpx;
  height: 88rpx;
  line-height: 88rpx;
  border-radius: 44rpx;
  padding: 0 30rpx;
  white-space: nowrap;
  box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.1);
  
  &:active {
    opacity: 0.8;
  }
}

.buy-btn {
  background: #ff4d4f;
  color: #fff;
  white-space: nowrap;
  box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.1);
  height: 88rpx;
  line-height: 88rpx;
  font-size: 32rpx;
  width: 280rpx;
  border-radius: 44rpx;
  
  &:active {
    opacity: 0.8;
  }
}

.error-tip {
  font-size: 24rpx;
  color: #ff4d4f;
  margin-top: 6rpx;
}

.disabled {
  opacity: 0.5;
  pointer-events: none;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.popup-content {
  animation: slideUp 0.3s ease;
}

.agreement-content {
  animation: fadeIn 0.3s ease;
}

.popup-content {
  .popup-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 20rpx;
    border-bottom: 1rpx solid #eee;
    
    .close-btn {
      font-size: 40rpx;
      color: #999;
      padding: 10rpx;
    }
  }
  
  .form-scroll {
    max-height: 60vh;
    padding: 30rpx 0;
  }
  
  .form-item {
    .label {
      &.required::before {
        content: '*';
        color: #ff4d4f;
        margin-right: 4rpx;
      }
    }
  }
  
  .popup-footer {
    padding-top: 20rpx;
    border-top: 1rpx solid #eee;
  }
}
</style> 