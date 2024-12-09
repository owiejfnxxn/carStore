<template>
  <view class="container">
    <!-- 轮播图部分 -->
    <swiper class="banner-swiper" circular autoplay interval="3000" duration="500" :indicator-dots="true">
      <swiper-item v-for="(item, index) in bannerList" :key="index" @click="goToDetail(item.id)">
        <view class="banner-box">
          <text class="banner-text">{{item.title}}</text>
        </view>
      </swiper-item>
    </swiper>
    
    <!-- 浮动按钮 -->
    <button class="more-products-btn" @click="goToProductList">
      <text></text>
      了解更多车型 >
    </button>
  </view>
</template>

<script>
export default {
  data() {
    return {
      bannerList: [
        { id: 1, title: '2024新款NK400现货发售' },
        { id: 2, title: '春风摩托全系特惠' },
        { id: 3, title: '骑行装备限时折扣' }
      ]
    }
  },
  methods: {
    goToDetail(id) {
      uni.navigateTo({
        url: `/pages/product/detail?id=${id}`
      })
    },
    goToProductList() {
      uni.navigateTo({
        url: '/pages/product/list'
      })
    }
  }
}
</script>

<style lang="scss" scoped>

.iconfont {
  font-family: "iconfont" !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.container {
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
}

.banner-swiper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 1;
  
  .banner-box {
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, #007AFF, #1989fa);
    display: flex;
    align-items: center;
    justify-content: center;
    
    .banner-text {
      color: #fff;
      font-size: 48rpx;
      font-weight: bold;
      text-align: center;
      padding: 0 60rpx;
    }
  }
}

.more-products-btn {
  position: fixed;
  left: 50%;
  bottom: 120rpx;
  transform: translateX(-50%);
  width: 80%;
  height: 80rpx;
  line-height: 80rpx;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  font-size: 32rpx;
  border-radius: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  
  &:active {
    opacity: 0.8;
    transform: translateX(-50%) scale(0.98);
  }
}
</style>
