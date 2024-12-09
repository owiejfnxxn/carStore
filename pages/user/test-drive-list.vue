<template>
  <view class="test-drive-container">
    <!-- 预约记录列表 -->
    <scroll-view 
      class="record-list" 
      scroll-y 
      @scrolltolower="loadMore"
      :refresher-enabled="true"
      :refresher-triggered="isRefreshing"
      @refresherrefresh="onRefresh"
    >
      <view class="record-item" v-for="(record, index) in recordList" :key="index">
        <view class="record-header">
          <text class="status" :class="record.status">{{getStatusText(record.status)}}</text>
          <text class="time">{{record.createTime}}</text>
        </view>
        
        <view class="product-info">
          <image :src="record.productImage" mode="aspectFill"/>
          <view class="info-content">
            <text class="product-name">{{record.productName}}</text>
            <text class="store-name">预约门店：{{record.storeName}}</text>
            <text class="drive-time">预约时间：{{record.driveTime}}</text>
          </view>
        </view>
        
        <view class="record-footer">
          <button 
            class="cancel-btn" 
            v-if="record.status === 'pending'"
            @tap="cancelRecord(record)"
          >取消预约</button>
          <button 
            class="detail-btn"
            @tap="viewDetail(record)"
          >查看详情</button>
        </view>
      </view>
      
      <!-- 空状态 -->
      <view class="empty-state" v-if="recordList.length === 0">
        <image src="/static/empty-record.png" mode="aspectFit"/>
        <text>暂无预约记录</text>
      </view>
      
      <!-- 加载更多 -->
      <view class="loading-more" v-if="recordList.length > 0">
        <text v-if="hasMore">加载中...</text>
        <text v-else>没有更多了</text>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      recordList: [
        // ... 可以添加更多记录
      ],
      page: 1,
      hasMore: true,
      isRefreshing: false
    }
  },
  
  onLoad() {
    // 获取本地存储的记录
    this.loadLocalRecords()
    
    // 监听记录更新
    uni.$on('updateTestDriveList', this.loadLocalRecords)
  },
  
  onUnload() {
    // 移除监听
    uni.$off('updateTestDriveList', this.loadLocalRecords)
  },
  
  methods: {
    loadLocalRecords() {
      try {
        const records = uni.getStorageSync('testDriveRecords') || []
        // 按时间倒序排序
        this.recordList = records.sort((a, b) => {
          return new Date(b.createTime) - new Date(a.createTime)
        })
      } catch (e) {
        console.error('获取记录失败:', e)
      }
    },
    
    getStatusText(status) {
      const statusMap = {
        pending: '待确认',
        confirmed: '已确认',
        completed: '已完成',
        cancelled: '已取消'
      }
      return statusMap[status] || status
    },
    
    loadMore() {
      // 本地数据无需分页加载
      this.hasMore = false
    },
    
    onRefresh() {
      this.isRefreshing = true
      this.loadLocalRecords()
      
      setTimeout(() => {
        this.isRefreshing = false
      }, 1000)
    },
    
    cancelRecord(record) {
      uni.showModal({
        title: '提示',
        content: '确定要取消预约吗？',
        success: (res) => {
          if (res.confirm) {
            uni.showLoading({ title: '处理中...' })
            
            setTimeout(() => {
              uni.hideLoading()
              
              try {
                // 更新本地存储
                const records = uni.getStorageSync('testDriveRecords') || []
                const index = records.findIndex(r => r.id === record.id)
                if (index > -1) {
                  records[index].status = 'cancelled'
                  records[index].cancelTime = new Date().toLocaleString()
                  uni.setStorageSync('testDriveRecords', records)
                  
                  // 更新当前记录状态
                  record.status = 'cancelled'
                  record.cancelTime = records[index].cancelTime
                }
              } catch (e) {
                console.error('取消预约失败:', e)
              }
              
              uni.showToast({
                title: '已取消预约',
                icon: 'success'
              })
            }, 1000)
          }
        }
      })
    },
    
    viewDetail(record) {
      uni.navigateTo({
        url: `/pages/user/test-drive-detail?id=${record.id}`,
        fail: () => {
          uni.showToast({
            title: '跳转失败',
            icon: 'none'
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.test-drive-container {
  min-height: 100vh;
  background: #f8f9fa;
}

.record-list {
  padding: 20rpx;
}

.record-item {
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  
  .record-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;
    
    .status {
      font-size: 28rpx;
      font-weight: 500;
      
      &.pending {
        color: #faad14;
      }
      
      &.confirmed {
        color: #007AFF;
      }
      
      &.completed {
        color: #52c41a;
      }
      
      &.cancelled {
        color: #999;
      }
    }
    
    .time {
      font-size: 24rpx;
      color: #999;
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
      
      .store-name,
      .drive-time {
        font-size: 26rpx;
        color: #666;
        margin-bottom: 8rpx;
        display: block;
      }
    }
  }
  
  .record-footer {
    display: flex;
    justify-content: flex-end;
    gap: 20rpx;
    padding-top: 20rpx;
    border-top: 1rpx solid #eee;
    
    button {
      min-width: 160rpx;
      height: 60rpx;
      line-height: 60rpx;
      font-size: 26rpx;
      border-radius: 30rpx;
      
      &.cancel-btn {
        color: #666;
        background: #f5f5f5;
        
        &:active {
          opacity: 0.8;
        }
      }
      
      &.detail-btn {
        color: #007AFF;
        background: #e6f7ff;
        
        &:active {
          opacity: 0.8;
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
    opacity: 0.5;
  }
  
  text {
    font-size: 28rpx;
    color: #999;
    
    &::after {
      content: '';
      display: block;
      width: 40rpx;
      height: 4rpx;
      background: #ddd;
      margin: 20rpx auto 0;
      border-radius: 2rpx;
    }
  }
}

.loading-more {
  text-align: center;
  padding: 30rpx 0;
  
  text {
    font-size: 24rpx;
    color: #999;
    position: relative;
    
    &::before,
    &::after {
      content: '';
      position: absolute;
      top: 50%;
      width: 80rpx;
      height: 1rpx;
      background: #eee;
    }
    
    &::before {
      right: calc(100% + 20rpx);
    }
    
    &::after {
      left: calc(100% + 20rpx);
    }
  }
}

// 下拉刷新样式
.uni-refresh {
  &-content {
    height: 80rpx;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  &-text {
    font-size: 28rpx;
    color: #999;
  }
}

// 列表动画
.record-item {
  animation: slideIn 0.3s ease;
  animation-fill-mode: both;
  
  @for $i from 1 through 10 {
    &:nth-child(#{$i}) {
      animation-delay: $i * 0.05s;
    }
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style> 