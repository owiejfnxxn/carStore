<template>
  <view class="points-container">
    <!-- 积分卡片 -->
    <view class="points-card">
      <view class="points-info">
        <text class="points-title">我的积分</text>
        <text class="points-value">{{userPoints}}</text>
      </view>
      <view class="points-actions">
        <view class="action-item" @tap="showRules">
          <text class="iconfont icon-rule"></text>
          <text>积分规则</text>
        </view>
        <view class="action-item" @tap="showDetails">
          <text class="iconfont icon-detail"></text>
          <text>积分明细</text>
        </view>
      </view>
    </view>
    
    <!-- 积分获取途径 -->
    <view class="points-ways">
      <view class="section-title">获取积分</view>
      <view class="ways-list">
        <view class="way-item" v-for="(way, index) in pointsWays" :key="index">
          <text class="iconfont" :class="way.icon"></text>
          <view class="way-info">
            <text class="way-name">{{way.name}}</text>
            <text class="way-desc">{{way.desc}}</text>
          </view>
          <text class="points">+{{way.points}}</text>
        </view>
      </view>
    </view>
    
    <!-- 积分记录 -->
    <view class="points-records">
      <view class="section-title">积分记录</view>
      <scroll-view 
        class="records-list" 
        scroll-y 
        @scrolltolower="loadMore"
        :refresher-enabled="true"
        :refresher-triggered="isRefreshing"
        @refresherrefresh="onRefresh"
      >
        <view 
          class="record-item" 
          v-for="(record, index) in pointsRecords" 
          :key="index"
        >
          <view class="record-info">
            <text class="record-name">{{record.name}}</text>
            <text class="record-time">{{record.time}}</text>
          </view>
          <text class="record-points" :class="{ minus: record.points < 0 }">
            {{record.points > 0 ? '+' : ''}}{{record.points}}
          </text>
        </view>
        
        <!-- 空状态 -->
        <view class="empty-state" v-if="pointsRecords.length === 0">
          <image src="/static/empty-points.png" mode="aspectFit"/>
          <text>暂无积分记录</text>
        </view>
        
        <!-- 加载更多 -->
        <view class="loading-more" v-if="pointsRecords.length > 0">
          <text v-if="hasMore">加载中...</text>
          <text v-else>没有更多了</text>
        </view>
      </scroll-view>
    </view>
    
    <!-- 积分规则弹窗 -->
    <view class="rules-popup" v-if="showRulesPopup">
      <view class="popup-mask" @tap="closeRules"></view>
      <view class="rules-content">
        <view class="rules-header">
          <text>积分规则</text>
          <text class="close-btn" @tap="closeRules">×</text>
        </view>
        <scroll-view scroll-y class="rules-text">
          <view class="rule-section" v-for="(rule, index) in pointsRules" :key="index">
            <text class="rule-title">{{index + 1}}. {{rule.title}}</text>
            <text class="rule-desc">{{rule.desc}}</text>
          </view>
        </scroll-view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      userPoints: 520,
      showRulesPopup: false,
      pointsWays: [
        {
          name: '购车成功',
          desc: '完成购车订单',
          points: 1000,
          icon: 'icon-car'
        },
        {
          name: '邀请好友',
          desc: '好友成功注册',
          points: 100,
          icon: 'icon-invite'
        },
        {
          name: '评价服务',
          desc: '完成服务评价',
          points: 50,
          icon: 'icon-comment'
        },
        {
          name: '分享商品',
          desc: '分享商品给好友',
          points: 10,
          icon: 'icon-share'
        }
      ],
      pointsRecords: [
        {
          name: '购车奖励',
          time: '2024-01-20 12:00:00',
          points: 1000
        },
        {
          name: '兑换礼品',
          time: '2024-01-19 15:30:00',
          points: -500
        }
      ],
      pointsRules: [
        {
          title: '积分获取',
          desc: '购车可获得订单金额1%的积分，1元=1积分'
        },
        {
          title: '积分有效期',
          desc: '积分自获得之日起有效期为一年'
        },
        {
          title: '积分使用',
          desc: '积分可用于商城兑换、保养抵扣等'
        },
        {
          title: '其他说明',
          desc: '积分不可转让，不可提现，最终解释权归本公司所有'
        }
      ],
      page: 1,
      hasMore: false,
      isRefreshing: false
    }
  },
  
  methods: {
    showRules() {
      this.showRulesPopup = true
    },
    
    closeRules() {
      this.showRulesPopup = false
    },
    
    showDetails() {
      uni.navigateTo({
        url: '/pages/user/points-detail'
      })
    },
    
    loadMore() {
      if (!this.hasMore) return
      this.page++
      this.loadRecords()
    },
    
    onRefresh() {
      this.isRefreshing = true
      this.page = 1
      this.pointsRecords = []
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
        
        this.pointsRecords = [...this.pointsRecords, ...mockRecords]
        this.hasMore = this.page < 3 // 模拟只有3页数据
      }, 1000)
    }
  }
}
</script>

<style lang="scss" scoped>
.points-container {
  min-height: 100vh;
  background: #f8f9fa;
  padding: 20rpx;
}

.points-card {
  background: linear-gradient(135deg, #007AFF, #1989fa);
  border-radius: 16rpx;
  padding: 40rpx 30rpx;
  color: #fff;
  margin-bottom: 20rpx;
  
  .points-info {
    text-align: center;
    margin-bottom: 40rpx;
    
    .points-title {
      font-size: 28rpx;
      opacity: 0.9;
      display: block;
      margin-bottom: 12rpx;
    }
    
    .points-value {
      font-size: 64rpx;
      font-weight: bold;
    }
  }
  
  .points-actions {
    display: flex;
    justify-content: space-around;
    
    .action-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      
      .iconfont {
        font-size: 48rpx;
        margin-bottom: 8rpx;
      }
      
      text {
        font-size: 24rpx;
        opacity: 0.9;
      }
    }
  }
}

.points-ways {
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  
  .section-title {
    font-size: 32rpx;
    font-weight: 500;
    color: #333;
    margin-bottom: 20rpx;
  }
  
  .ways-list {
    .way-item {
      display: flex;
      align-items: center;
      padding: 20rpx 0;
      
      &:not(:last-child) {
        border-bottom: 1rpx solid #eee;
      }
      
      .iconfont {
        font-size: 48rpx;
        color: #007AFF;
        margin-right: 20rpx;
      }
      
      .way-info {
        flex: 1;
        
        .way-name {
          font-size: 28rpx;
          color: #333;
          margin-bottom: 6rpx;
          display: block;
        }
        
        .way-desc {
          font-size: 24rpx;
          color: #999;
        }
      }
      
      .points {
        font-size: 32rpx;
        color: #ff4d4f;
        font-weight: 500;
      }
    }
  }
}

.points-records {
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  
  .section-title {
    font-size: 32rpx;
    font-weight: 500;
    color: #333;
    margin-bottom: 20rpx;
  }
  
  .records-list {
    max-height: 600rpx;
    
    .record-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20rpx 0;
      
      &:not(:last-child) {
        border-bottom: 1rpx solid #eee;
      }
      
      .record-info {
        .record-name {
          font-size: 28rpx;
          color: #333;
          margin-bottom: 6rpx;
          display: block;
        }
        
        .record-time {
          font-size: 24rpx;
          color: #999;
        }
      }
      
      .record-points {
        font-size: 32rpx;
        color: #ff4d4f;
        font-weight: 500;
        
        &.minus {
          color: #52c41a;
        }
      }
    }
  }
}

.empty-state {
  padding: 60rpx 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  
  image {
    width: 200rpx;
    height: 200rpx;
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

.rules-popup {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  
  .popup-mask {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.5);
  }
  
  .rules-content {
    position: relative;
    z-index: 1;
    animation: popIn 0.3s ease;
  }
}

@keyframes popIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style> 