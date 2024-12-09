<template>
  <view class="detail-container">
    <!-- 订单状态 -->
    <view class="status-card">
      <view class="status-header">
        <text class="status-text" :class="orderInfo.status">{{getStatusText(orderInfo.status)}}</text>
        <text class="status-desc">{{getStatusDesc(orderInfo.status)}}</text>
      </view>
      <view class="status-timeline" v-if="orderInfo.status !== 'cancelled'">
        <view class="timeline-item" :class="{ active: orderInfo.status !== 'pending' }">
          <text class="time">{{orderInfo.createTime}}</text>
          <text class="text">提交订单</text>
        </view>
        <view class="timeline-item" :class="{ active: ['paid', 'refunding', 'completed'].includes(orderInfo.status) }">
          <text class="time">{{orderInfo.payTime || '-'}}</text>
          <text class="text">支付定金</text>
        </view>
        <view class="timeline-item" v-if="orderInfo.status === 'refunding'" :class="{ active: true }">
          <text class="time">{{orderInfo.refundTime || '-'}}</text>
          <text class="text">申请退款</text>
        </view>
        <view class="timeline-item" v-if="orderInfo.status !== 'refunding'"  :class="{ active: orderInfo.status === 'completed' }">
          <text class="time">{{orderInfo.completeTime || '-'}}</text>
          <text class="text">完成交付</text>
        </view>
        <view class="timeline-item" v-else :class="{ active: orderInfo.status === 'refunding' }">
          <text class="time">{{orderInfo.refundTime || '-'}}</text>
          <text class="text">退款完成</text>
        </view>

      </view>
    </view>
    
    <!-- 商品信息 -->
    <view class="info-card">
      <view class="card-title">商品信息</view>
      <view class="product-info">
        <image :src="orderInfo.productImage" mode="aspectFill"/>
        <view class="info-content">
          <text class="product-name">{{orderInfo.productName}}</text>
          <view class="product-specs">
            <text class="spec-item">{{orderInfo.color}}</text>
            <text class="spec-item">{{orderInfo.config}}</text>
          </view>
          <view class="price-info">
            <text class="deposit">定金：¥{{orderInfo.deposit}}</text>
            <text class="total">总价：¥{{orderInfo.totalPrice}}</text>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 订单信息 -->
    <view class="info-card">
      <view class="card-title">订单信息</view>
      <view class="info-list">
        <view class="info-item">
          <text class="label">订单编号</text>
          <text class="value">{{orderInfo.orderNo}}</text>
        </view>
        <view class="info-item">
          <text class="label">创建时间</text>
          <text class="value">{{orderInfo.createTime}}</text>
        </view>
        <view class="info-item" v-if="orderInfo.payTime">
          <text class="label">支付时间</text>
          <text class="value">{{orderInfo.payTime}}</text>
        </view>
        <view class="info-item" v-if="orderInfo.completeTime">
          <text class="label">完成时间</text>
          <text class="value">{{orderInfo.completeTime}}</text>
        </view>
        <view class="info-item" v-if="orderInfo.cancelTime">
          <text class="label">取消时间</text>
          <text class="value">{{orderInfo.cancelTime}}</text>
        </view>
        <view class="info-item" v-if="orderInfo.refundTime">
          <text class="label">退款申请时间</text>
          <text class="value">{{orderInfo.refundTime}}</text>
        </view>
      </view>
    </view>
    
    <!-- 提车信息 -->
    <view class="info-card">
      <view class="card-title">提车信息</view>
      <view class="info-list">
        <view class="info-item">
          <text class="label">提车城市</text>
          <text class="value">{{orderInfo.city || '上海'}}</text>
        </view>
        <view class="info-item">
          <text class="label">提车门店</text>
          <text class="value">{{orderInfo.store || '浦东店'}}</text>
        </view>
        <view class="info-item">
          <text class="label">联系电话</text>
          <text class="value">{{orderInfo.phone || '021-12345678'}}</text>
        </view>
      </view>
    </view>
    
    <!-- 底部按钮 -->
    <view class="action-bar" v-if="showActionBar">
      <button 
        class="cancel-btn" 
        v-if="orderInfo.status === 'pending'"
        @tap="cancelOrder"
      >取消订单</button>
      <button 
        class="refund-btn" 
        v-if="orderInfo.status === 'paid' && orderInfo.status !== 'refunding'"
        @tap="applyRefund"
      >申请退款</button>
      <button 
        class="pay-btn" 
        v-if="orderInfo.status === 'pending'"
        @tap="goPay"
      >去支付</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      orderNo: '',
      orderInfo: null
    }
  },
  
  computed: {
    showActionBar() {
      return ['pending', 'paid'].includes(this.orderInfo?.status) && this.orderInfo?.status !== 'refunding'
    }
  },
  
  onLoad(options) {
    if (options.orderNo) {
      this.orderNo = options.orderNo
      this.loadOrderDetail()
    }
  },
  
  methods: {
    loadOrderDetail() {
      // 模拟加载订单详情
      const mockOrders = [
        {
          orderNo: 'CF20240120001',
          status: 'pending',
          productImage: 'https://via.placeholder.com/200x200',
          productName: '2024款 春风NK400',
          color: '曜石黑',
          config: '豪华版',
          deposit: '5000',
          totalPrice: '68800',
          createTime: '2024-01-20 12:00:00'
        },
        {
          orderNo: 'CF20240119001',
          status: 'paid',
          productImage: 'https://via.placeholder.com/200x200',
          productName: '2024款 春风NK250',
          color: '珍珠白',
          config: '运动版',
          deposit: '3000',
          totalPrice: '46800',
          createTime: '2024-01-19 15:30:00',
          payTime: '2024-01-19 15:35:00'
        },
        {
          orderNo: 'CF20240118001',
          status: 'completed',
          productImage: 'https://via.placeholder.com/200x200',
          productName: '2024款 春风150NK',
          color: '赛道红',
          config: '标准版',
          deposit: '2000',
          totalPrice: '28800',
          createTime: '2024-01-18 10:00:00',
          payTime: '2024-01-18 10:05:00',
          completeTime: '2024-01-19 14:00:00'
        },
        {
          orderNo: 'CF20240117001',
          status: 'cancelled',
          productImage: 'https://via.placeholder.com/200x200',
          productName: '2024款 春风400GT',
          color: '曜石黑',
          config: '豪华版',
          deposit: '5000',
          totalPrice: '72800',
          createTime: '2024-01-17 16:00:00',
          cancelTime: '2024-01-17 16:30:00'
        }
      ]
      this.orderInfo = mockOrders[this.orderNo] || null
    },
    
    getStatusText(status) {
      const statusMap = {
        pending: '待付款',
        paid: '已付款',
        refunding: '退款中',
        completed: '已完成',
        cancelled: '已取消'
      }
      return statusMap[status] || status
    },
    
    getStatusDesc(status) {
      const descMap = {
        pending: '请在24小时内完成支付',
        paid: '定金已支付，请等待提车通知',
        refunding: '退款申请已提交，请等待处理',
        completed: '订单已完成',
        cancelled: '订单已取消'
      }
      return descMap[status] || ''
    },
    
    cancelOrder() {
      uni.showModal({
        title: '提示',
        content: '确定要取消该订单吗？',
        success: (res) => {
          if (res.confirm) {
            uni.showLoading({ title: '处理中...' })
            
            setTimeout(() => {
              uni.hideLoading()
              uni.showToast({
                title: '订单已取消',
                icon: 'success'
              })
              
              this.orderInfo.status = 'cancelled'
              this.orderInfo.cancelTime = new Date().toLocaleString()
            }, 1000)
          }
        }
      })
    },
    
    applyRefund() {
      uni.showModal({
        title: '退款提示',
        content: '确定申请退款吗？退款将在1-3个工作日内处理。',
        success: (res) => {
          if (res.confirm) {
            uni.showLoading({ title: '提交中...' })
            
            // 模拟退款申请
            setTimeout(() => {
              uni.hideLoading()
              uni.showToast({
                title: '申请已提交',
                icon: 'success'
              })
              
              // 更新订单状态
              this.orderInfo.status = 'refunding'
              this.orderInfo.refundTime = new Date().toLocaleString()
              
              // 通知订单列表页面刷新
              uni.$emit('orderStatusChanged', {
                orderNo: this.orderInfo.orderNo,
                status: 'refunding',
                refundTime: this.orderInfo.refundTime
              })
              
              setTimeout(() => {
                uni.navigateBack()
              }, 1500)
            }, 1500)
          }
        }
      })
    },
    
    goPay() {
      uni.showModal({
        title: '支付提示',
        content: `确定支付定金 ¥${this.orderInfo.deposit} 吗？`,
        success: (res) => {
          if (res.confirm) {
            uni.showLoading({ title: '支付中...' })
            
            // 模拟支付过程
            setTimeout(() => {
              uni.hideLoading()
              uni.showToast({
                title: '支付成功',
                icon: 'success'
              })
              
              // 更新订单状态
              this.orderInfo.status = 'paid'
              this.orderInfo.payTime = new Date().toLocaleString()
              
              // 通知订单列表页面刷新
              uni.$emit('orderStatusChanged', {
                orderNo: this.orderInfo.orderNo,
                status: 'paid',
                payTime: this.orderInfo.payTime
              })
              
              setTimeout(() => {
                uni.navigateBack()
              }, 1500)
            }, 2000)
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.detail-container {
  min-height: 100vh;
  background: #f8f9fa;
  padding-bottom: 120rpx;
}

.status-card {
  background: linear-gradient(135deg, #007AFF, #1989fa);
  padding: 40rpx 30rpx;
  color: #fff;
  
  .status-header {
    margin-bottom: 40rpx;
    
    .status-text {
      font-size: 36rpx;
      font-weight: 500;
      margin-bottom: 12rpx;
      display: block;
    }
    
    .status-desc {
      font-size: 26rpx;
      opacity: 0.9;
    }
  }
  
  .status-timeline {
    display: flex;
    justify-content: space-between;
    position: relative;
    padding: 20rpx 0;
    
    &::before {
      content: '';
      position: absolute;
      left: 30rpx;
      right: 30rpx;
      top: 50%;
      height: 2rpx;
      background: rgba(255,255,255,0.3);
    }
    
    .timeline-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
      z-index: 1;
      
      &::before {
        content: '';
        width: 20rpx;
        height: 20rpx;
        background: rgba(255,255,255,0.3);
        border-radius: 50%;
        margin-bottom: 12rpx;
      }
      
      &.active {
        &::before {
          background: #fff;
          box-shadow: 0 0 10rpx rgba(255,255,255,0.5);
        }
        
        .time, .text {
          opacity: 1;
        }
      }
      
      .time {
        font-size: 22rpx;
        margin-bottom: 6rpx;
        opacity: 0.6;
      }
      
      .text {
        font-size: 24rpx;
        opacity: 0.6;
      }
    }
  }
}

.info-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin: 20rpx;
  
  .card-title {
    font-size: 30rpx;
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
}

.product-info {
  display: flex;
  
  image {
    width: 160rpx;
    height: 160rpx;
    border-radius: 12rpx;
    margin-right: 20rpx;
  }
  
  .info-content {
    flex: 1;
    
    .product-name {
      font-size: 28rpx;
      color: #333;
      font-weight: 500;
      margin-bottom: 12rpx;
      display: block;
    }
    
    .product-specs {
      margin-bottom: 12rpx;
      
      .spec-item {
        display: inline-block;
        padding: 4rpx 12rpx;
        font-size: 24rpx;
        color: #666;
        background: #f5f5f5;
        border-radius: 4rpx;
        margin-right: 10rpx;
      }
    }
    
    .price-info {
      text {
        font-size: 26rpx;
        color: #ff4d4f;
        margin-right: 20rpx;
      }
    }
  }
}

.info-list {
  .info-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20rpx 0;
    font-size: 28rpx;
    
    &:not(:last-child) {
      border-bottom: 1rpx solid #eee;
    }
    
    .label {
      color: #666;
    }
    
    .value {
      color: #333;
    }
  }
}

.action-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff;
  padding: 20rpx 30rpx;
  display: flex;
  justify-content: flex-end;
  gap: 20rpx;
  box-shadow: 0 -2rpx 20rpx rgba(0,0,0,0.05);
  
  button {
    min-width: 180rpx;
    height: 72rpx;
    line-height: 72rpx;
    font-size: 28rpx;
    border-radius: 36rpx;
    
    &.cancel-btn {
      color: #666;
      background: #f5f5f5;
    }
    
    &.refund-btn {
      color: #ff4d4f;
      background: #fff2f0;
    }
    
    &.pay-btn {
      color: #fff;
      background: linear-gradient(135deg, #007AFF, #1989fa);
    }
  }
}
</style> 