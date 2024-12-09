<template>
  <view class="order-container">
    <!-- 订单状态切换 -->
    <scroll-view class="status-tabs" scroll-x>
      <view 
        class="tab-item" 
        v-for="(tab, index) in statusTabs" 
        :key="index"
        :class="{ active: currentTab === index }"
        @tap="switchTab(index)"
      >
        <text>{{tab.name}}</text>
      </view>
    </scroll-view>
    
    <!-- 订单列表 -->
    <scroll-view 
      class="order-list" 
      scroll-y 
      @scrolltolower="loadMore"
      :refresher-enabled="true"
      :refresher-triggered="isRefreshing"
      @refresherrefresh="onRefresh"
    >
      <view class="order-item" v-for="(order, index) in orderList" :key="index">
        <view class="order-header">
          <text class="order-no">订单号：{{order.orderNo}}</text>
          <text class="order-status" :class="order.status">{{getStatusText(order.status)}}</text>
        </view>
        
        <view class="product-info">
          <image :src="order.productImage" mode="aspectFill"/>
          <view class="info-content">
            <text class="product-name">{{order.productName}}</text>
            <view class="product-specs">
              <text class="spec-item">{{order.color}}</text>
              <text class="spec-item">{{order.config}}</text>
            </view>
            <view class="price-info">
              <text class="deposit">定金：¥{{order.deposit}}</text>
              <text class="total">总价：¥{{order.totalPrice}}</text>
            </view>
          </view>
        </view>
        
        <view class="order-footer">
          <text class="time">{{order.createTime}}</text>
          <view class="action-btns">
            <button 
              class="cancel-btn" 
              v-if="order.status === 'pending'"
              @tap="cancelOrder(order)"
            >取消订单</button>
            <button 
              class="refund-btn" 
              v-if="order.status === 'paid'"
              @tap="applyRefund(order)"
            >申请退款</button>
            <button 
              class="detail-btn"
              @tap="viewDetail(order)"
            >查看详情</button>
          </view>
        </view>
      </view>
      
      <!-- 空状态 -->
      <view class="empty-state" v-if="orderList.length === 0">
        <image src='https://via.placeholder.com/600x400' mode="aspectFit"/>
        <text>暂无相关订单</text>
      </view>
      
      <!-- 加载更多 -->
      <!-- <view class="loading-more" v-if="orderList.length > 0">
        <text v-if="hasMore">加载中...</text>
        <text v-else>没有更多了</text>
      </view> -->
    </scroll-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      statusTabs: [
        { name: '全部', value: 'all' },
        { name: '待付款', value: 'pending' },
        { name: '已付款', value: 'paid' },
        { name: '退款中', value: 'refunding' },
        { name: '已完成', value: 'completed' },
        { name: '已取消', value: 'cancelled' }
      ],
      currentTab: 0,
      allOrders: [
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
      ],
      orderList: [],
      page: 1,
      hasMore: true,
      isRefreshing: false
    }
  },
  
  onLoad() {
    this.loadOrders()
    uni.$on('orderStatusChanged', this.handleOrderStatusChange)
  },
  
  onUnload() {
    uni.$off('orderStatusChanged', this.handleOrderStatusChange)
  },
  
  methods: {
    switchTab(index) {
      if (this.currentTab === index) return
      this.currentTab = index
      this.page = 1
      this.filterOrders()
      this.hasMore = true
    },
    
    filterOrders() {
      const status = this.statusTabs[this.currentTab].value
      const filteredOrders = status === 'all' 
        ? this.allOrders 
        : this.allOrders.filter(order => order.status === status)
      
      const pageSize = 10
      const start = (this.page - 1) * pageSize
      const end = this.page * pageSize
      const pageOrders = filteredOrders.slice(start, end)
      
      if (this.page === 1) {
        this.orderList = pageOrders
      } else {
        this.orderList = [...this.orderList, ...pageOrders]
      }
      
      this.hasMore = end < filteredOrders.length
    },
    
    loadOrders() {
      setTimeout(() => {
        this.filterOrders()
      }, 1000)
    },
    
    loadMore() {
      if (!this.hasMore) return
      this.page++
      this.loadOrders()
    },
    
    onRefresh() {
      this.isRefreshing = true
      this.page = 1
      this.hasMore = true
      
      this.loadOrders()
      
      setTimeout(() => {
        this.isRefreshing = false
      }, 1000)
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
    
    cancelOrder(order) {
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
              
              // 更新订单状态
              order.status = 'cancelled'
              order.cancelTime = new Date().toLocaleString()
              // 重新筛选订单列表
              this.filterOrders()
            }, 1000)
          }
        }
      })
    },
    
    applyRefund(order) {
      uni.showModal({
        title: '申请退款',
        content: '确定要申请退款吗？退款将在1-3个工作日内处理。',
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
              order.status = 'refunding'
              order.refundTime = new Date().toLocaleString()
              // 重新筛选订单列表
              this.filterOrders()
            }, 1500)
          }
        }
      })
    },
    
    viewDetail(order) {
      uni.navigateTo({
        url: `/pages/user/order-detail?orderNo=${order.orderNo}`,
        fail: () => {
          uni.showToast({
            title: '跳转失败',
            icon: 'none'
          })
        }
      })
    },
    
    handleOrderStatusChange(data) {
      // 更新对应订单的状态
      const order = this.allOrders.find(o => o.orderNo === data.orderNo)
      if (order) {
        order.status = data.status
        if (data.payTime) order.payTime = data.payTime
        if (data.refundTime) order.refundTime = data.refundTime
        // 重新筛选订单列表
        this.filterOrders()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.order-container {
  min-height: 100vh;
  background: #f8f9fa;
  display: flex;
  flex-direction: column;
}

.status-tabs {
  background: #fff;
  white-space: nowrap;
  border-bottom: 1rpx solid #eee;
  
  .tab-item {
    display: inline-block;
    padding: 30rpx 40rpx;
    font-size: 28rpx;
    color: #666;
    position: relative;
    
    &.active {
      color: #007AFF;
      font-weight: 500;
      
      &::after {
        content: '';
        position: absolute;
        left: 40rpx;
        right: 40rpx;
        bottom: 0;
        height: 4rpx;
        background: #007AFF;
        border-radius: 2rpx;
      }
    }
  }
}

.order-list {
  flex: 1;
  padding: 20rpx;
}

.order-item {
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  
  .order-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;
    
    .order-no {
      font-size: 26rpx;
      color: #999;
    }
    
    .order-status {
      font-size: 28rpx;
      font-weight: 500;
      
      &.pending {
        color: #faad14;
      }
      
      &.paid {
        color: #007AFF;
      }
      
      &.refunding {
        color: #ff4d4f;
      }
      
      &.completed {
        color: #52c41a;
      }
      
      &.cancelled {
        color: #999;
      }
    }
  }
  
  .product-info {
    display: flex;
    margin-bottom: 20rpx;
    
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
  
  .order-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 20rpx;
    border-top: 1rpx solid #eee;
    
    .time {
      font-size: 24rpx;
      color: #999;
    }
    
    .action-btns {
      display: flex;
      gap: 20rpx;
      
      button {
        min-width: 160rpx;
        height: 60rpx;
        line-height: 60rpx;
        font-size: 26rpx;
        border-radius: 30rpx;
        
        &.cancel-btn {
          color: #666;
          background: #f5f5f5;
        }
        
        &.refund-btn {
          color: #ff4d4f;
          background: #fff2f0;
        }
        
        &.detail-btn {
          color: #007AFF;
          background: #e6f7ff;
        }
      }
    }
  }
}

.empty-state {
  padding: 100rpx 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  
  image {
    width: 240rpx;
    height: 240rpx;
    margin-bottom: 20rpx;
  }
  
  text {
    font-size: 28rpx;
    color: #999;
  }
}

.loading-more {
  text-align: center;
  padding: 30rpx 0;
  
  text {
    font-size: 24rpx;
    color: #999;
  }
}
</style> 