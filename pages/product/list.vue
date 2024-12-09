<template>
  <view class="list-container">
    <!-- 产品系列选择 -->
    <view class="series-title">分类</view>
    <scroll-view class="series-scroll" scroll-x>
      <view 
        class="series-item" 
        v-for="(item, index) in categories" 
        :key="index"
        :class="{ active: currentCategory === index }"
        @tap="switchCategory(index)"
      >
        <text>{{item.name}}</text>
      </view>
    </scroll-view>
    
    <!-- 子分类选择器 -->
    <scroll-view 
      class="sub-categories" 
      scroll-x 
      v-if="showSubCategories"
    >
      <view 
        class="sub-item"
        v-for="(item, index) in currentSubCategories"
        :key="index"
        :class="{ active: currentSubCategory === item.name }"
        @tap="switchSubCategory(item.name)"
      >
        {{item.name}}
      </view>
    </scroll-view>
    
    <!-- 产品主图展示 -->
    <view class="main-product">
      <view class="series-image">
        <text class="iconfont icon-motorcycle"></text>
        <text class="product-name">{{selectedProduct.name}}</text>
      </view>
      <view class="series-info">
        <text class="series-name">{{currentCategoryInfo.name}}</text>
        <text class="series-desc">{{currentCategoryInfo.description}}</text>
        <text class="product-price">¥{{selectedProduct.price}}</text>
        <button class="detail-btn" @tap="goToDetail(selectedProduct.id)">查看详情</button>
      </view>
    </view>
    
    <!-- 产品轮播图 -->
    <swiper class="products-swiper" circular autoplay interval="3000" duration="500">
      <swiper-item v-for="(group, groupIndex) in groupedProducts" :key="groupIndex">
        <view class="products-grid">
          <view 
            class="product-item" 
            v-for="(product, index) in group" 
            :key="index"
            @tap="selectProduct(product)"
            :class="{ active: selectedProduct.id === product.id }"
          >
            <view class="product-image">
              <text class="iconfont icon-motorcycle"></text>
            </view>
            <view class="product-info">
              <text class="name">{{product.name}}</text>
              <text class="price">¥{{product.price}}</text>
              <text class="category">{{product.category}}</text>
            </view>
          </view>
        </view>
      </swiper-item>
    </swiper>
  </view>
</template>

<script>
export default {
  data() {
    return {
      currentCategory: 0,
      currentSubCategory: '',
      selectedProduct: null,
      categories: [
        { name: '车型系列', type: 'series' },
        { name: '机车配件', type: 'parts' }
      ],
      seriesList: [
        { name: 'NK系列', description: '都市运动街车，为城市而生' },
        { name: 'GT系列', description: '舒适旅行，自由远行' },
        { name: 'MT系列', description: '探索无限可能' },
        { name: 'SR系列', description: '竞速精神，运动基因' },
        { name: 'CU系列', description: '都市运动街车，为城市而生' }
      ],
      partsList: [
        { name: '保养件', description: '原厂正品配件，品质保障' },
        { name: '制动系统', description: '确保安全的核心部件' },
        { name: '传动系统', description: '动力传递的关键部件' }
      ],
      products: {
        'NK系列': [
          { id: 1, name: 'NK400', price: '68800', type: 'series' },
          { id: 2, name: 'NK300', price: '52800', type: 'series' }
        ],
        'GT系列': [
          { id: 3, name: '650GT', price: '75800', type: 'series' },
          { id: 4, name: '400GT', price: '65800', type: 'series' }
        ],
        '保养件': [
          { id: 11, name: '机油', price: '288', type: 'parts' },
          { id: 12, name: '机油滤芯', price: '68', type: 'parts' }
        ],
        '制动系统': [
          { id: 13, name: '刹车片', price: '328', type: 'parts' }
        ],
        '传动系统': [
          { id: 14, name: '链条', price: '468', type: 'parts' }
        ]
      }
    }
  },
  computed: {
    currentSubCategories() {
      return this.categories[this.currentCategory].type === 'series' 
        ? this.seriesList 
        : this.partsList
    },
    showSubCategories() {
      return true
    },
    currentCategoryInfo() {
      const subCategory = this.currentSubCategory || this.currentSubCategories[0].name
      return {
        name: subCategory,
        description: this.currentSubCategories.find(item => item.name === subCategory)?.description
      }
    },
    currentProducts() {
      const subCategory = this.currentSubCategory || this.currentSubCategories[0].name
      return this.products[subCategory] || []
    },
    groupedProducts() {
      const products = this.currentProducts
      const groups = []
      for (let i = 0; i < products.length; i += 2) {
        groups.push(products.slice(i, i + 2))
      }
      return groups
    }
  },
  created() {
    this.selectedProduct = this.products['NK系列'][0]
  },
  methods: {
    switchCategory(index) {
      this.currentCategory = index
      this.currentSubCategory = this.currentSubCategories[0].name
      this.updateSelectedProduct()
    },
    switchSubCategory(category) {
      this.currentSubCategory = category
      this.updateSelectedProduct()
    },
    updateSelectedProduct() {
      const products = this.currentProducts
      if (products.length > 0) {
        this.selectedProduct = products[0]
      }
    },
    selectProduct(product) {
      this.selectedProduct = product
    },
    goToDetail(id) {
      uni.navigateTo({
        url: `/pages/product/detail?id=${id}`
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.list-container {
  min-height: 100vh;
  background: #f5f5f5;
}
.series-title {
    font-size: 24rpx;
    background: #fff;
    padding-right: 30rpx;
    position: relative;
    color: rgba(102, 102, 102, 0.6);
    &::after {
      content: '';
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 100%;
      height: 1rpx;
      background: rgba(0, 0, 0, 0.1);
    }
  }
.series-scroll {
  background: #fff;
  white-space: nowrap;
  padding: 20rpx 30rpx;
  border-bottom: 1rpx solid #eee;
//   margin-right: 20rpx;
  .series-item {
    display: inline-block;
    padding: 12rpx 30rpx;
    font-size: 28rpx;
    color: #333;
    background: #f5f5f5;
    margin-right: 20rpx;
    
    transition: all 0.3s ease;
    
    &.active {
      color: #fff;
      background: #333;
      font-weight: normal;
      
      &::after {
        display: none;
      }
    }
    
    &:last-child {
      margin-right: 0;
    }
  }
}

.main-product {
  margin: 20rpx;
  border-radius: 12rpx;
  overflow: hidden;
  background: #fff;
  
  .series-image {
    width: 100%;
    height: 500rpx;
    background: #f5f5f5;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    
    .iconfont {
      font-size: 160rpx;
      color: #999;
      margin-bottom: 20rpx;
    }
    
    .product-name {
      font-size: 32rpx;
      color: #666;
    }
  }
  
  .series-info {
    padding: 30rpx;
    text-align: center;
    
    .series-name {
      font-size: 36rpx;
      font-weight: bold;
      color: #333;
      margin-bottom: 10rpx;
      display: block;
    }
    
    .series-desc {
      font-size: 28rpx;
      color: #666;
      margin-bottom: 20rpx;
      display: block;
    }
    
    .product-price {
      font-size: 40rpx;
      color: #ff4d4f;
      font-weight: bold;
      margin-bottom: 30rpx;
      display: block;
    }
    
    .detail-btn {
      width: 300rpx;
      height: 80rpx;
      line-height: 80rpx;
      background: #007AFF;
      color: #fff;
      font-size: 28rpx;
      border-radius: 40rpx;
      margin: 0 auto;
    }
  }
}

.products-swiper {
  height: 300rpx;
  background: #fff;
  margin: 20rpx;
  border-radius: 12rpx;
  
  .products-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20rpx;
    padding: 20rpx;
  }
  
  .product-item {
    background: #f5f5f5;
    border-radius: 8rpx;
    overflow: hidden;
    transition: all 0.3s;
    
    &.active {
      transform: scale(0.95);
      box-shadow: 0 0 20rpx rgba(0,122,255,0.3);
      
      .product-image {
        background: #e6f0ff;
        
        .iconfont {
          color: #007AFF;
        }
      }
    }
    
    .product-image {
      width: 100%;
      height: 160rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      
      .iconfont {
        font-size: 80rpx;
        color: #999;
      }
    }
    
    .product-info {
      padding: 15rpx;
      background: #fff;
      
      .name {
        font-size: 28rpx;
        color: #333;
        display: block;
      }
      
      .price {
        font-size: 32rpx;
        color: #ff4d4f;
        font-weight: bold;
        margin-top: 10rpx;
      }
      
      .category {
        font-size: 24rpx;
        color: #999;
        margin-top: 6rpx;
      }
    }
  }
}

.sub-categories {
  background: #fff;
  white-space: nowrap;
  padding: 20rpx 30rpx;
  border-bottom: 1rpx solid #eee;
  
  .sub-item {
    display: inline-block;
    padding: 8rpx 24rpx;
    font-size: 26rpx;
    color: #666;
    background: #f5f5f5;
    margin-right: 20rpx;
    border-radius: 24rpx;
    transition: all 0.3s ease;
    
    &.active {
      color: #fff;
      background: #007AFF;
    }
    
    &:last-child {
      margin-right: 0;
    }
  }
}
</style> 