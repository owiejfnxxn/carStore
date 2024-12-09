<template>
  <view class="detail-container">
    <!-- 状态卡片 -->
    <view class="status-card">
      <view class="status-header">
        <text class="status-text" :class="record.status">{{getStatusText(record.status)}}</text>
        <text class="status-desc">{{getStatusDesc(record.status)}}</text>
      </view>
      <view class="status-timeline" v-if="record.status !== 'cancelled'">
        <view class="timeline-item" :class="{ active: true }">
          <text class="time">{{record.createTime}}</text>
          <text class="text">提交预约</text>
        </view>
        <view class="timeline-item" :class="{ active: ['confirmed', 'completed'].includes(record.status) }">
          <text class="time">{{record.confirmTime || '-'}}</text>
          <text class="text">门店确认</text>
        </view>
        <view class="timeline-item" :class="{ active: record.status === 'completed' }">
          <text class="time">{{record.completeTime || '-'}}</text>
          <text class="text">完成试驾</text>
        </view>
      </view>
    </view>
    
    <!-- 车型信息 -->
    <view class="info-card">
      <view class="card-title">车型信息</view>
      <view class="product-info">
        <image :src="record.productImage" mode="aspectFill"/>
        <view class="info-content">
          <text class="product-name">{{record.productName}}</text>
        </view>
      </view>
    </view>
    
    <!-- 预约信息 -->
    <view class="info-card">
      <view class="card-title">预约信息</view>
      <view class="info-list">
        <view class="info-item">
          <text class="label">预约门店</text>
          <view class="value-action">
            <text>{{record.storeName}}</text>
            <button class="contact-btn" @tap="contactStore">联系门店</button>
          </view>
        </view>
        <view class="info-item">
          <text class="label">预约时间</text>
          <text class="value">{{record.driveTime}}</text>
        </view>
        <view class="info-item">
          <text class="label">联系人</text>
          <text class="value">{{record.name}}</text>
        </view>
        <view class="info-item">
          <text class="label">联系电话</text>
          <text class="value">{{record.phone}}</text>
        </view>
        <view class="info-item" v-if="record.remark">
          <text class="label">备注信息</text>
          <text class="value">{{record.remark}}</text>
        </view>
      </view>
    </view>
    
    <!-- 记录信息 -->
    <view class="info-card">
      <view class="card-title">记录信息</view>
      <view class="info-list">
        <view class="info-item">
          <text class="label">创建时间</text>
          <text class="value">{{record.createTime}}</text>
        </view>
        <view class="info-item" v-if="record.confirmTime">
          <text class="label">确认时间</text>
          <text class="value">{{record.confirmTime}}</text>
        </view>
        <view class="info-item" v-if="record.completeTime">
          <text class="label">完成时间</text>
          <text class="value">{{record.completeTime}}</text>
        </view>
        <view class="info-item" v-if="record.cancelTime">
          <text class="label">取消时间</text>
          <text class="value">{{record.cancelTime}}</text>
        </view>
      </view>
    </view>
    
    <!-- 底部按钮 -->
    <view class="action-bar" v-if="record.status === 'pending'">
      <button class="cancel-btn" @tap="cancelRecord">取消预约</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      recordId: '',
      record: null
    }
  },
  
  onLoad(options) {
    if (options.id) {
      this.recordId = options.id
      this.loadRecord()
    }
  },
  
  methods: {
    loadRecord() {
      try {
        // 从本地存储加载试驾记录
        const records = uni.getStorageSync('testDriveRecords') || []
        this.record = records.find(r => r.id == this.recordId)
        
        if (!this.record) {
          uni.showToast({
            title: '记录不存在',
            icon: 'none'
          })
          setTimeout(() => {
            uni.navigateBack()
          }, 1500)
        }
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
    
    getStatusDesc(status) {
      const descMap = {
        pending: '等待门店确认',
        confirmed: '门店已确认，请按时到店',
        completed: '试驾已完成',
        cancelled: '预约已取消'
      }
      return descMap[status] || ''
    },
    
    // 联系门店
    contactStore() {
      uni.showActionSheet({
        itemList: ['拨打门店电话', '查看门店地址'],
        success: (res) => {
          switch(res.tapIndex) {
            case 0:
              uni.makePhoneCall({
                phoneNumber: this.record.storePhone || '021-12345678',
                fail: () => {
                  uni.showToast({
                    title: '拨打失败',
                    icon: 'none'
                  })
                }
              })
              break
            case 1:
              // 跳转到门店详情页
              uni.navigateTo({
                url: `/pages/spots/detail?id=${this.record.storeId}`
              })
              break
          }
        }
      })
    },
    
    cancelRecord() {
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
                const index = records.findIndex(r => r.id == this.recordId)
                if (index > -1) {
                  records[index].status = 'cancelled'
                  records[index].cancelTime = new Date().toLocaleString()
                  uni.setStorageSync('testDriveRecords', records)
                }

                // 更新当前记录状态
                this.record.status = 'cancelled'
                this.record.cancelTime = records[index].cancelTime

                uni.showToast({
                  title: '已取消预约',
                  icon: 'success'
                })

                // 通知列表页更新
                uni.$emit('updateTestDriveList')

                setTimeout(() => {
                  uni.navigateBack()
                }, 1500)
              } catch (e) {
                console.error('取消预约失败:', e)
                uni.showToast({
                  title: '操作失败',
                  icon: 'none'
                })
              }
            }, 1000)
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
  align-items: center;
  
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
    }
  }
}

.info-list {
  .info-item {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 20rpx 0;
    font-size: 28rpx;
    
    &:not(:last-child) {
      border-bottom: 1rpx solid #eee;
    }
    
    .label {
      color: #666;
      min-width: 140rpx;
    }
    
    .value {
      flex: 1;
      color: #333;
      text-align: right;
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
  box-shadow: 0 -2rpx 20rpx rgba(0,0,0,0.05);
  
  .cancel-btn {
    width: 100%;
    height: 88rpx;
    line-height: 88rpx;
    background: #f5f5f5;
    color: #ff4d4f;
    font-size: 32rpx;
    border-radius: 44rpx;
    
    &:active {
      opacity: 0.8;
    }
  }
}

.value-action {
  display: flex;
  align-items: center;
  
  text {
    color: #333;
    margin-right: 20rpx;
  }
  
  .contact-btn {
    min-width: 140rpx;
    height: 48rpx;
    line-height: 48rpx;
    font-size: 24rpx;
    color: #007AFF;
    background: #e6f7ff;
    border-radius: 24rpx;
    padding: 0 20rpx;
    
    &:active {
      opacity: 0.8;
    }
  }
}
</style> 