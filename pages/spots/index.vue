<template>
  <view class="spots-container">
    <!-- 搜索和筛选栏 -->
    <view class="search-bar">
      <view class="search-input">
        <text class="iconfont icon-search"></text>
        <input 
          v-model="searchKey" 
          placeholder="搜索门店名称/地址"
          @confirm="handleSearch"
        />
      </view>
      <view class="filter-btn" @tap="showFilter">
        <text class="iconfont icon-filter"></text>
        <text>筛选</text>
      </view>
    </view>
    
    <!-- 筛选弹窗 -->
    <uni-popup ref="filterPopup" type="bottom">
      <view class="filter-panel">
        <view class="filter-header">
          <text>门店筛选</text>
          <text class="close-btn" @tap="closeFilter">×</text>
        </view>
        
        <view class="filter-content">
          <view class="filter-section">
            <text class="section-title">门店等级</text>
            <view class="tag-list">
              <text 
                class="tag" 
                v-for="level in levels" 
                :key="level"
                :class="{ active: selectedLevel === level }"
                @tap="selectLevel(level)"
              >{{level}}级店</text>
            </view>
          </view>
          
          <view class="filter-section">
            <text class="section-title">服务类型</text>
            <view class="tag-list">
              <text 
                class="tag" 
                v-for="(service, index) in services" 
                :key="index"
                :class="{ active: selectedServices.includes(service.value) }"
                @tap="toggleService(service.value)"
              >{{service.label}}</text>
            </view>
          </view>
        </view>
        
        <view class="filter-footer">
          <button class="reset-btn" @tap="resetFilter">重置</button>
          <button class="confirm-btn" @tap="confirmFilter">确定</button>
        </view>
      </view>
    </uni-popup>
    
    <!-- 地图组件 -->
    <map
      id="map"
      class="map"
      :latitude="latitude"
      :longitude="longitude"
      :markers="markers"
      :scale="12"
      show-location
      @markertap="handleMarkerTap"
    ></map>
    
    <!-- 门店详情弹窗 -->
    <view class="store-popup" v-if="showStoreDetail">
      <view class="store-card">
        <view class="store-header">
          <view class="store-info">
            <text class="store-name">{{currentStore.name}}</text>
            <view class="store-tags">
              <text class="tag level">{{currentStore.level}}级店</text>
              <text class="tag" v-if="currentStore.hasFinance">金融分期</text>
              <text class="tag" v-if="currentStore.canRegister">代客上牌</text>
            </view>
          </view>
          <text class="close-btn" @tap="closeStoreDetail">×</text>
        </view>
        
        <!-- 门店图片轮播 -->
        <swiper 
          class="store-swiper" 
          circular 
          :indicator-dots="currentStore.images.length > 1"
          indicator-color="rgba(255,255,255,0.6)"
          indicator-active-color="#fff"
        >
          <swiper-item v-for="(img, index) in currentStore.images" :key="index">
            <image :src="img" mode="aspectFill"/>
          </swiper-item>
        </swiper>
        
        <!-- 门店信息 -->
        <view class="store-content">
          <view class="info-item">
            <text class="icon iconfont icon-location"></text>
            <text class="info-text">{{currentStore.address}}</text>
            <button class="nav-btn" @tap="navigate(currentStore)">导航</button>
          </view>
          
          <view class="info-item">
            <text class="icon iconfont icon-phone"></text>
            <text class="info-text">{{currentStore.phone}}</text>
            <button class="call-btn" @tap="makeCall(currentStore.phone)">拨打</button>
          </view>
          
          <view class="info-item">
            <text class="icon iconfont icon-service"></text>
            <text class="info-text">售后：{{currentStore.serviceName}}</text>
            <button class="call-btn" @tap="makeCall(currentStore.servicePhone)">拨打</button>
          </view>
          
          <view class="service-list">
            <view class="service-item" v-for="(service, index) in currentStore.services" :key="index">
              <text class="iconfont" :class="service.icon"></text>
              <text>{{service.name}}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      latitude: 31.230416,
      longitude: 121.473701,
      markers: [],
      showStoreDetail: false,
      currentStore: null,
      storeList: [
        {
          id: 1,
          name: '春风上海浦东店',
          latitude: 31.230416,
          longitude: 121.473701,
          address: '上海市浦东新区xx路xx号',
          phone: '021-12345678',
          serviceName: '张经理',
          servicePhone: '138xxxx1234',
          level: 'A',
          hasFinance: true,
          canRegister: true,
          images: [
            'https://via.placeholder.com/600x400',
            'https://via.placeholder.com/600x400'
          ],
          services: [
            { name: '整车销售', icon: 'icon-sale' },
            { name: '维修保养', icon: 'icon-repair' },
            { name: '金融分期', icon: 'icon-finance' },
            { name: '代客上牌', icon: 'icon-register' }
          ]
        },
        {
          id: 2,
          name: '春风上海静安店',
          latitude: 31.235123,
          longitude: 121.456789,
          address: '上海市静安区xx路xx号',
          phone: '021-87654321',
          serviceName: '李经理',
          servicePhone: '137xxxx5678',
          level: 'A',
          hasFinance: true,
          canRegister: true,
          images: [
            'https://via.placeholder.com/600x400',
            'https://via.placeholder.com/600x400'
          ],
          services: [
            { name: '整车销售', icon: 'icon-sale' },
            { name: '维修保养', icon: 'icon-repair' },
            { name: '金融分期', icon: 'icon-finance' },
            { name: '代客上牌', icon: 'icon-register' }
          ]
        },
        {
          id: 3,
          name: '春风上海徐汇店',
          latitude: 31.198123,
          longitude: 121.436789,
          address: '上海市徐汇区xx路xx号',
          phone: '021-76543210',
          serviceName: '王经理',
          servicePhone: '136xxxx9012',
          level: 'B',
          hasFinance: true,
          canRegister: false,
          images: [
            'https://via.placeholder.com/600x400'
          ],
          services: [
            { name: '整车销售', icon: 'icon-sale' },
            { name: '维修保养', icon: 'icon-repair' },
            { name: '金融分期', icon: 'icon-finance' }
          ]
        },
        {
          id: 4,
          name: '春风上海松江店',
          latitude: 31.032123,
          longitude: 121.226789,
          address: '上海市松江区xx路xx号',
          phone: '021-65432109',
          serviceName: '赵经理',
          servicePhone: '135xxxx3456',
          level: 'B',
          hasFinance: false,
          canRegister: true,
          images: [
            'https://via.placeholder.com/600x400'
          ],
          services: [
            { name: '整车销售', icon: 'icon-sale' },
            { name: '维修保养', icon: 'icon-repair' },
            { name: '代客上牌', icon: 'icon-register' }
          ]
        },
        {
          id: 5,
          name: '春风上海嘉定店',
          latitude: 31.382123,
          longitude: 121.266789,
          address: '上海市嘉定区xx路xx号',
          phone: '021-54321098',
          serviceName: '孙经理',
          servicePhone: '134xxxx7890',
          level: 'C',
          hasFinance: false,
          canRegister: false,
          images: [
            'https://via.placeholder.com/600x400'
          ],
          services: [
            { name: '整车销售', icon: 'icon-sale' },
            { name: '维修保养', icon: 'icon-repair' }
          ]
        }
      ],
      searchKey: '',
      levels: ['A', 'B', 'C'],
      selectedLevel: '',
      services: [
        { label: '金融分期', value: 'finance' },
        { label: '代客上牌', value: 'register' },
        { label: '维修保养', value: 'repair' },
        { label: '整车销售', value: 'sale' }
      ],
      selectedServices: [],
      filteredStores: []
    }
  },
  
  onLoad() {
    this.initMarkers()
    this.getCurrentLocation()
  },
  
  methods: {
    // 初始化地图标记
    initMarkers() {
      this.markers = this.storeList.map(store => ({
        id: store.id,
        latitude: store.latitude,
        longitude: store.longitude,
        width: 32,
        height: 32,
        callout: {
          content: store.name,
          color: '#333',
          fontSize: 12,
          borderRadius: 4,
          padding: 8,
          display: 'ALWAYS'
        }
      }))
    },
    
    // 获取当前位置
    getCurrentLocation() {
      uni.getLocation({
        type: 'gcj02',
        success: (res) => {
          this.latitude = res.latitude
          this.longitude = res.longitude
        },
        fail: () => {
          uni.showToast({
            title: '获取位置失败',
            icon: 'none'
          })
        }
      })
    },
    
    // 点击标记
    handleMarkerTap(e) {
      const store = this.storeList.find(s => s.id === e.markerId)
      if (store) {
        this.currentStore = store
        this.showStoreDetail = true
      }
    },
    
    // 关闭门店详情
    closeStoreDetail() {
      this.showStoreDetail = false
      this.currentStore = null
    },
    
    // 导航到门店
    navigate(store) {
      uni.showActionSheet({
        itemList: ['腾讯地图', '高德地图', '百度地图', '苹果地图'],
        success: (res) => {
          switch(res.tapIndex) {
            case 0: // 腾讯地图
              this.openTencentMap(store)
              break
            case 1: // 高德地图
              this.openAMap(store)
              break
            case 2: // 百度地图
              this.openBaiduMap(store)
              break
            case 3: // 苹果地图
              this.openAppleMap(store)
              break
          }
        }
      })
    },
    
    // 打开腾讯地图
    openTencentMap(store) {
      // 腾讯地图 URL Scheme
      const url = `qqmap://map/geocoder?coord=${store.latitude},${store.longitude}&referer=你很机车`
      
      // 尝试打开腾讯地图
      plus.runtime.openURL(url, (err) => {
        if (err) {
          // 如果打开失败，提示下载
          uni.showModal({
            title: '提示',
            content: '您尚未安装腾讯地图，是否前往下载？',
            success: (res) => {
              if (res.confirm) {
                plus.runtime.openURL('https://map.qq.com/mobile/')
              }
            }
          })
        }
      })
    },
    
    // 打开高德地图
    openAMap(store) {
      // 高德地图 URL Scheme
      const url = `androidamap://navi?sourceApplication=你很机车&lat=${store.latitude}&lon=${store.longitude}&dev=0&style=2`
      
      plus.runtime.openURL(url, (err) => {
        if (err) {
          uni.showModal({
            title: '提示',
            content: '您尚未安装高德地图，是否前往下载？',
            success: (res) => {
              if (res.confirm) {
                plus.runtime.openURL('https://mobile.amap.com/')
              }
            }
          })
        }
      })
    },
    
    // 打开百度地图
    openBaiduMap(store) {
      // 百度地图 URL Scheme
      const url = `baidumap://map/direction?destination=${store.latitude},${store.longitude}&coord_type=gcj02&mode=driving&src=你很机车`
      
      plus.runtime.openURL(url, (err) => {
        if (err) {
          uni.showModal({
            title: '提示',
            content: '您尚未安装百度地图，是否前往下载？',
            success: (res) => {
              if (res.confirm) {
                plus.runtime.openURL('https://map.baidu.com/zt/client/index/')
              }
            }
          })
        }
      })
    },
    
    // 打开苹果地图(仅iOS)
    openAppleMap(store) {
      // 苹果地图 URL Scheme
      const url = `http://maps.apple.com/?ll=${store.latitude},${store.longitude}&q=${encodeURIComponent(store.name)}`
      
      // iOS直接打开，安卓提示不支持
      if (uni.getSystemInfoSync().platform === 'ios') {
        plus.runtime.openURL(url)
      } else {
        uni.showToast({
          title: '仅支持iOS设备',
          icon: 'none'
        })
      }
    },
    
    // 拨打电话
    makeCall(phone) {
      uni.makePhoneCall({
        phoneNumber: phone,
        fail: () => {
          uni.showToast({
            title: '拨打失败',
            icon: 'none'
          })
        }
      })
    },
    
    handleSearch() {
      this.filterStores()
    },
    
    showFilter() {
      this.$refs.filterPopup.open()
    },
    
    closeFilter() {
      this.$refs.filterPopup.close()
    },
    
    selectLevel(level) {
      this.selectedLevel = this.selectedLevel === level ? '' : level
      this.filterStores()
    },
    
    toggleService(service) {
      const index = this.selectedServices.indexOf(service)
      if (index > -1) {
        this.selectedServices.splice(index, 1)
      } else {
        this.selectedServices.push(service)
      }
      this.filterStores()
    },
    
    resetFilter() {
      this.selectedLevel = ''
      this.selectedServices = []
      this.filterStores()
      this.closeFilter()
    },
    
    confirmFilter() {
      this.filterStores()
      this.closeFilter()
    },
    
    filterStores() {
      // 复制原始数据
      let result = [...this.storeList]
      
      // 关键词搜索
      if (this.searchKey.trim()) {
        const key = this.searchKey.toLowerCase().trim()
        result = result.filter(store => 
          store.name.toLowerCase().includes(key) || 
          store.address.toLowerCase().includes(key)
        )
      }
      
      // 等级筛选
      if (this.selectedLevel) {
        result = result.filter(store => store.level === this.selectedLevel)
      }
      
      // 服务筛选
      if (this.selectedServices.length) {
        result = result.filter(store => {
          return this.selectedServices.every(service => {
            switch(service) {
              case 'finance':
                return store.hasFinance
              case 'register':
                return store.canRegister
              case 'repair':
                return store.services.some(s => s.name === '维修保养')
              case 'sale':
                return store.services.some(s => s.name === '整车销售')
              default:
                return true
            }
          })
        })
      }
      
      this.filteredStores = result
      this.updateMarkers()
    },
    
    updateMarkers() {
      this.markers = this.filteredStores.map(store => ({
        id: store.id,
        latitude: store.latitude,
        longitude: store.longitude,
        width: 32,
        height: 32,
        callout: {
          content: store.name,
          color: '#333',
          fontSize: 12,
          borderRadius: 4,
          padding: 8,
          display: 'ALWAYS'
        }
      }))
    }
  }
}
</script>

<style lang="scss" scoped>
.spots-container {
  height: 100vh;
  position: relative;
}

.map {
  width: 100%;
  height: 100%;
}

.store-popup {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  z-index: 100;
  
  .store-card {
    background: #fff;
    border-radius: 24rpx 24rpx 0 0;
    padding: 30rpx;
    animation: slideUp 0.3s ease;
    
    .store-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 20rpx;
      
      .store-info {
        flex: 1;
        margin-right: 20rpx;
        
        .store-name {
          font-size: 32rpx;
          font-weight: bold;
          color: #333;
          margin-bottom: 12rpx;
          display: block;
        }
        
        .store-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 12rpx;
          
          .tag {
            font-size: 22rpx;
            padding: 4rpx 12rpx;
            border-radius: 4rpx;
            background: #f5f5f5;
            color: #666;
            
            &.level {
              background: #e6f7ff;
              color: #007AFF;
            }
          }
        }
      }
      
      .close-btn {
        font-size: 40rpx;
        color: #999;
        padding: 10rpx;
      }
    }
    
    .store-swiper {
      width: 100%;
      height: 300rpx;
      border-radius: 12rpx;
      overflow: hidden;
      margin-bottom: 20rpx;
      
      image {
        width: 100%;
        height: 100%;
      }
    }
    
    .store-content {
      .info-item {
        display: flex;
        align-items: center;
        margin-bottom: 20rpx;
        
        .icon {
          font-size: 32rpx;
          color: #999;
          margin-right: 12rpx;
        }
        
        .info-text {
          flex: 1;
          font-size: 28rpx;
          color: #333;
        }
        
        button {
          min-width: 120rpx;
          height: 56rpx;
          line-height: 56rpx;
          font-size: 24rpx;
          border-radius: 28rpx;
          margin-left: 20rpx;
          
          &.nav-btn {
            background: #007AFF;
            color: #fff;
          }
          
          &.call-btn {
            background: #f5f5f5;
            color: #666;
          }
        }
      }
      
      .service-list {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 20rpx;
        margin-top: 30rpx;
        
        .service-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          
          .iconfont {
            font-size: 48rpx;
            color: #007AFF;
            margin-bottom: 8rpx;
          }
          
          text {
            font-size: 24rpx;
            color: #666;
          }
        }
      }
    }
  }
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

.search-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  padding: 20rpx;
  background: #fff;
  display: flex;
  align-items: center;
  z-index: 99;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05);
  
  .search-input {
    flex: 1;
    height: 72rpx;
    background: #f5f5f5;
    border-radius: 36rpx;
    display: flex;
    align-items: center;
    padding: 0 24rpx;
    margin-right: 20rpx;
    
    .icon-search {
      font-size: 32rpx;
      color: #999;
      margin-right: 12rpx;
    }
    
    input {
      flex: 1;
      font-size: 28rpx;
    }
  }
  
  .filter-btn {
    display: flex;
    align-items: center;
    padding: 0 24rpx;
    height: 72rpx;
    background: #f5f5f5;
    border-radius: 36rpx;
    
    .icon-filter {
      font-size: 28rpx;
      color: #666;
      margin-right: 8rpx;
    }
    
    text {
      font-size: 28rpx;
      color: #666;
    }
  }
}

.filter-panel {
  background: #fff;
  border-radius: 24rpx 24rpx 0 0;
  
  .filter-header {
    padding: 30rpx;
    text-align: center;
    font-size: 32rpx;
    font-weight: 500;
    position: relative;
    
    .close-btn {
      position: absolute;
      right: 20rpx;
      top: 50%;
      transform: translateY(-50%);
      font-size: 40rpx;
      color: #999;
      padding: 10rpx;
    }
  }
  
  .filter-content {
    padding: 0 30rpx;
    
    .filter-section {
      margin-bottom: 30rpx;
      
      .section-title {
        font-size: 28rpx;
        color: #333;
        margin-bottom: 20rpx;
        display: block;
      }
      
      .tag-list {
        display: flex;
        flex-wrap: wrap;
        gap: 20rpx;
        
        .tag {
          padding: 12rpx 24rpx;
          font-size: 26rpx;
          color: #666;
          background: #f5f5f5;
          border-radius: 8rpx;
          
          &.active {
            background: #e6f7ff;
            color: #007AFF;
          }
        }
      }
    }
  }
  
  .filter-footer {
    padding: 30rpx;
    display: flex;
    gap: 20rpx;
    
    button {
      flex: 1;
      height: 88rpx;
      line-height: 88rpx;
      font-size: 32rpx;
      border-radius: 44rpx;
      
      &.reset-btn {
        background: #f5f5f5;
        color: #666;
      }
      
      &.confirm-btn {
        background: #007AFF;
        color: #fff;
      }
    }
  }
}
</style> 