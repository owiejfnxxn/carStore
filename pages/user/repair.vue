<template>
  <view class="repair-container">
    <!-- 维修保养记录列表 -->
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
          <text class="type" :class="record.type">{{getTypeText(record.type)}}</text>
          <text class="status" :class="record.status">{{getStatusText(record.status)}}</text>
        </view>
        
        <view class="record-content">
          <view class="info-item">
            <text class="label">预约门店</text>
            <text class="value">{{record.storeName}}</text>
          </view>
          <view class="info-item">
            <text class="label">预约时间</text>
            <text class="value">{{record.appointTime}}</text>
          </view>
          <view class="info-item">
            <text class="label">问题描述</text>
            <text class="value">{{record.description}}</text>
          </view>
        </view>
        
        <view class="record-footer">
          <text class="time">{{record.createTime}}</text>
          <view class="action-btns">
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
      </view>
      
      <!-- 空状态 -->
      <view class="empty-state" v-if="recordList.length === 0">
        <image src="/static/empty-repair.png" mode="aspectFit"/>
        <text>暂无维修保养记录</text>
        <button class="add-btn" @tap="goToAdd">立即预约</button>
      </view>
      
      <!-- 加载更多 -->
      <view class="loading-more" v-if="recordList.length > 0">
        <text v-if="hasMore">加载中...</text>
        <text v-else>没有更多了</text>
      </view>
    </scroll-view>
    
    <!-- 悬浮按钮 -->
    <view class="float-btn" v-if="recordList.length > 0" @tap="goToAdd">
      <text class="iconfont icon-add">+</text>
      <text>预约维修保养</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      recordList: [],
      page: 1,
      hasMore: true,
      isRefreshing: false
    }
  },
  
  onLoad() {
    // 获取本地存储的记录
    const records = uni.getStorageSync('repairRecords') || []
    this.recordList = records
    
    // 监听新预约
    uni.$on('updateRepairRecords', this.handleNewAppointment)
  },
  
  onUnload() {
    // 移除监听
    uni.$off('updateRepairRecords', this.handleNewAppointment)
  },
  
  methods: {
    handleNewAppointment(appointment) {
      // 添加新预约到列表开头
      this.recordList.unshift(appointment)
    },
    
    getTypeText(type) {
      const typeMap = {
        repair: '维修',
        maintenance: '保养'
      }
      return typeMap[type] || type
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
      if (!this.hasMore) return
      this.page++
      this.loadRecords()
    },
    
    onRefresh() {
      this.isRefreshing = true
      this.page = 1
      this.recordList = []
      this.hasMore = true
      
      this.loadRecords()
      
      setTimeout(() => {
        this.isRefreshing = false
      }, 1000)
    },
    
    loadRecords() {
      // 模拟加载数据
      setTimeout(() => {
        const mockRecords = [
          // ... 可以添加更多模拟数据
        ]
        
        this.recordList = [...this.recordList, ...mockRecords]
        this.hasMore = this.page < 3 // 模拟只有3页数据
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
              // 更新本地存储
              try {
                const records = uni.getStorageSync('repairRecords') || []
                const index = records.findIndex(r => r.id === record.id)
                if (index > -1) {
                  records[index].status = 'cancelled'
                  records[index].cancelTime = new Date().toLocaleString()
                  uni.setStorageSync('repairRecords', records)
                  
                  // 更新当前记录状态
                  record.status = 'cancelled'
                  record.cancelTime = records[index].cancelTime
                }
              } catch (e) {
                console.error('更新记录失败:', e)
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
        url: `/pages/user/repair-detail?id=${record.id}`
      })
    },
    
    goToAdd() {
      uni.navigateTo({
        url: '/pages/user/repair-add'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.repair-container {
  min-height: 100vh;
  background: #f8f9fa;
  padding-bottom: 120rpx;
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
    
    .type {
      font-size: 28rpx;
      font-weight: 500;
      padding: 4rpx 16rpx;
      border-radius: 4rpx;
      
      &.repair {
        color: #ff4d4f;
        background: #fff1f0;
      }
      
      &.maintenance {
        color: #52c41a;
        background: #f6ffed;
      }
    }
    
    .status {
      font-size: 26rpx;
      
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
  }
  
  .record-content {
    background: #f8f9fa;
    border-radius: 12rpx;
    padding: 20rpx;
    margin-bottom: 20rpx;
    
    .info-item {
      display: flex;
      margin-bottom: 12rpx;
      
      &:last-child {
        margin-bottom: 0;
      }
      
      .label {
        width: 140rpx;
        font-size: 26rpx;
        color: #666;
      }
      
      .value {
        flex: 1;
        font-size: 26rpx;
        color: #333;
      }
    }
  }
  
  .record-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
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
    margin-bottom: 30rpx;
  }
  
  .add-btn {
    width: 300rpx;
    height: 80rpx;
    line-height: 80rpx;
    background: #007AFF;
    color: #fff;
    font-size: 28rpx;
    border-radius: 40rpx;
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

.float-btn {
  position: fixed;
  right: 30rpx;
  bottom: 100rpx;
  height: 88rpx;
  background: #007AFF;
  color: #fff;
  font-size: 28rpx;
  border-radius: 44rpx;
  padding: 0 40rpx;
  display: flex;
  align-items: center;
  box-shadow: 0 4rpx 16rpx rgba(0,122,255,0.3);
  
  .icon-add {
    font-size: 40rpx;
    margin-right: 8rpx;
  }
}
</style> 