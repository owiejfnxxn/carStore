<template>
  <view class="repair-add-container">
    <!-- 表单内容 -->
    <view class="form-section">
      <!-- 预约类型 -->
      <view class="form-item">
        <text class="label required">预约类型</text>
        <view class="type-select">
          <view 
            class="type-item" 
            v-for="(type, index) in types" 
            :key="index"
            :class="{ active: formData.type === type.value }"
            @tap="selectType(type.value)"
          >
            <text class="iconfont" :class="type.icon"></text>
            <text>{{type.label}}</text>
          </view>
        </view>
      </view>
      
      <!-- 城市选择 -->
      <view class="form-item">
        <text class="label required">您的城市</text>
        <picker 
          @change="handleCityChange" 
          :value="cityIndex" 
          :range="cities"
          :class="{ error: showErrors && cityIndex < 0 }"
        >
          <view class="picker">{{cities[cityIndex] || '请选择城市'}}</view>
        </picker>
        <text class="error-tip" v-if="showErrors && cityIndex < 0">请选择城市</text>
      </view>
      
      <!-- 门店选择 -->
      <view class="form-item">
        <text class="label required">门店选择</text>
        <picker 
          @change="handleStoreChange" 
          :value="storeIndex" 
          :range="currentStores"
          :disabled="cityIndex < 0"
          :class="{ error: showErrors && cityIndex >= 0 && storeIndex < 0 }"
        >
          <view class="picker">{{currentStores[storeIndex] || '请选择门店'}}</view>
        </picker>
        <text class="error-tip" v-if="showErrors && cityIndex >= 0 && storeIndex < 0">请选择门店</text>
      </view>
      
      <!-- 预约时间 -->
      <view class="form-item">
        <text class="label required">预约时间</text>
        <picker 
          mode="date" 
          :start="startDate" 
          :end="endDate"
          @change="handleDateChange"
          :class="{ error: showErrors && !formData.date }"
        >
          <view class="picker">{{formData.date || '请选择日期'}}</view>
        </picker>
        <text class="error-tip" v-if="showErrors && !formData.date">请选择预约时间</text>
      </view>
      
      <!-- 时间段选择 -->
      <view class="form-item" v-if="formData.date">
        <text class="label required">时间段</text>
        <view class="time-slots">
          <text 
            v-for="(slot, index) in timeSlots" 
            :key="index"
            :class="{ active: formData.timeSlot === slot }"
            @tap="selectTimeSlot(slot)"
          >{{slot}}</text>
        </view>
        <text class="error-tip" v-if="showErrors && !formData.timeSlot">请选择时间段</text>
      </view>
      
      <!-- 问题描述 -->
      <view class="form-item">
        <text class="label required">{{formData.type === 'repair' ? '问题描述' : '保养项目'}}</text>
        <textarea
          v-model="formData.description"
          :placeholder="formData.type === 'repair' ? '请描述您遇到的问题' : '请描述需要保养的项目'"
          :class="{ error: showErrors && !formData.description }"
          maxlength="200"
        />
        <text class="word-count">{{formData.description.length}}/200</text>
        <text class="error-tip" v-if="showErrors && !formData.description">请填写{{formData.type === 'repair' ? '问题描述' : '保养项目'}}</text>
      </view>
      
      <!-- 联系方式 -->
      <view class="form-item">
        <text class="label required">联系方式</text>
        <input 
          v-model="formData.phone"
          type="number"
          maxlength="11"
          placeholder="请输入手机号"
          :class="{ error: showErrors && !isValidPhone }"
        />
        <text class="error-tip" v-if="showErrors && !formData.phone">请输入联系方式</text>
        <text class="error-tip" v-if="showErrors && formData.phone && !isValidPhone">请输入正确的手机号</text>
      </view>
    </view>
    
    <!-- 提交按钮 -->
    <view class="submit-section">
      <button 
        class="submit-btn" 
        :disabled="isSubmitting"
        @tap="submitForm"
      >
        {{ isSubmitting ? '提交中...' : '提交预约' }}
      </button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      types: [
        { label: '维修', value: 'repair', icon: 'icon-repair' },
        { label: '保养', value: 'maintenance', icon: 'icon-maintenance' }
      ],
      formData: {
        type: 'repair',
        date: '',
        timeSlot: '',
        description: '',
        phone: ''
      },
      cities: ['北京', '上海', '广州', '深圳'],
      cityIndex: -1,
      storeIndex: -1,
      storeMap: {
        '北京': ['朝阳店', '海淀店', '丰台店'],
        '上海': ['浦东店', '静安店', '徐汇店'],
        '广州': ['天河店', '越秀店', '海珠店'],
        '深圳': ['南山店', '福田店', '罗湖店']
      },
      timeSlots: ['9:00-11:00', '11:00-13:00', '14:00-16:00', '16:00-18:00'],
      showErrors: false,
      isSubmitting: false
    }
  },
  
  computed: {
    currentStores() {
      return this.cityIndex >= 0 ? this.storeMap[this.cities[this.cityIndex]] : []
    },
    
    startDate() {
      const date = new Date()
      return date.toISOString().split('T')[0]
    },
    
    endDate() {
      const date = new Date()
      date.setDate(date.getDate() + 30)
      return date.toISOString().split('T')[0]
    },
    
    isValidPhone() {
      return /^1[3-9]\d{9}$/.test(this.formData.phone)
    }
  },
  
  methods: {
    selectType(type) {
      this.formData.type = type
    },
    
    handleCityChange(e) {
      this.cityIndex = e.detail.value
      this.storeIndex = -1
    },
    
    handleStoreChange(e) {
      this.storeIndex = e.detail.value
    },
    
    handleDateChange(e) {
      this.formData.date = e.detail.value
      this.formData.timeSlot = ''
    },
    
    selectTimeSlot(slot) {
      this.formData.timeSlot = slot
    },
    
    validateForm() {
      this.showErrors = true
      
      if (this.cityIndex < 0) return false
      if (this.storeIndex < 0) return false
      if (!this.formData.date) return false
      if (!this.formData.timeSlot) return false
      if (!this.formData.description) return false
      if (!this.isValidPhone) return false
      
      return true
    },
    
    submitForm() {
      if (!this.validateForm()) return
      if (this.isSubmitting) return
      
      // 检查登录状态
      const isLoggedIn = uni.getStorageSync('isLoggedIn')
      if (!isLoggedIn) {
        uni.showModal({
          title: '提示',
          content: '预约维修保养需要登录，是否前往登录？',
          success: (res) => {
            if (res.confirm) {
              uni.navigateTo({
                url: '/pages/login/index'
              })
            }
          }
        })
        return
      }
      
      this.isSubmitting = true
      uni.showLoading({ title: '提交中...' })
      
      // 构建预约数据
      const appointmentData = {
        id: Date.now(),
        type: this.formData.type,
        status: 'pending',
        storeName: this.currentStores[this.storeIndex],
        appointTime: `${this.formData.date} ${this.formData.timeSlot}`,
        description: this.formData.description,
        phone: this.formData.phone,
        createTime: new Date().toLocaleString()
      }
      
      // 模拟提交
      setTimeout(() => {
        uni.hideLoading()
        this.isSubmitting = false
        
        // 保存到本地记录
        try {
          const records = uni.getStorageSync('repairRecords') || []
          records.unshift(appointmentData)
          uni.setStorageSync('repairRecords', records)
          
          // 通知列表页更新
          uni.$emit('updateRepairRecords', appointmentData)
        } catch (e) {
          console.error('保存记录失败:', e)
        }
        
        uni.showToast({
          title: '预约成功',
          icon: 'success'
        })
        
        setTimeout(() => {
          uni.navigateBack()
        }, 1500)
      }, 1500)
    }
  }
}
</script>

<style lang="scss" scoped>
.repair-add-container {
  min-height: 100vh;
  background: #f8f9fa;
  padding-bottom: 120rpx;
}

.form-section {
  background: #fff;
  padding: 30rpx;
  
  .form-item {
    margin-bottom: 30rpx;
    position: relative;
    
    .label {
      font-size: 28rpx;
      color: #333;
      margin-bottom: 12rpx;
      display: block;
      
      &.required::before {
        content: '*';
        color: #ff4d4f;
        margin-right: 4rpx;
      }
    }
    
    .type-select {
      display: flex;
      gap: 20rpx;
      
      .type-item {
        flex: 1;
        height: 120rpx;
        background: #f8f9fa;
        border-radius: 12rpx;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        
        .iconfont {
          font-size: 48rpx;
          color: #999;
          margin-bottom: 8rpx;
        }
        
        text {
          font-size: 28rpx;
          color: #666;
        }
        
        &.active {
          background: #e6f7ff;
          
          .iconfont {
            color: #007AFF;
          }
          
          text {
            color: #007AFF;
          }
        }
      }
    }
    
    .picker {
      height: 88rpx;
      line-height: 88rpx;
      background: #f8f9fa;
      border-radius: 12rpx;
      padding: 0 24rpx;
      font-size: 28rpx;
      color: #333;
      
      &.error {
        background: #fff2f0;
        border: 2rpx solid #ff4d4f;
      }
      
      &[disabled] {
        color: #999;
        background: #f5f5f5;
      }
    }
    
    .time-slots {
      display: flex;
      flex-wrap: wrap;
      gap: 20rpx;
      
      text {
        min-width: 160rpx;
        height: 72rpx;
        line-height: 72rpx;
        text-align: center;
        background: #f8f9fa;
        border-radius: 8rpx;
        font-size: 26rpx;
        color: #666;
        
        &.active {
          background: #e6f7ff;
          color: #007AFF;
        }
      }
    }
    
    textarea {
      width: 100%;
      height: 200rpx;
      background: #f8f9fa;
      border-radius: 12rpx;
      padding: 24rpx;
      font-size: 28rpx;
      color: #333;
      
      &.error {
        background: #fff2f0;
        border: 2rpx solid #ff4d4f;
      }
    }
    
    input {
      width: 100%;
      height: 88rpx;
      background: #f8f9fa;
      border-radius: 12rpx;
      padding: 0 24rpx;
      font-size: 28rpx;
      color: #333;
      
      &.error {
        background: #fff2f0;
        border: 2rpx solid #ff4d4f;
      }
    }
    
    .word-count {
      position: absolute;
      right: 24rpx;
      bottom: 24rpx;
      font-size: 24rpx;
      color: #999;
    }
    
    .error-tip {
      font-size: 24rpx;
      color: #ff4d4f;
      margin-top: 8rpx;
    }
  }
}

.submit-section {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff;
  padding: 20rpx 30rpx;
  box-shadow: 0 -2rpx 20rpx rgba(0,0,0,0.05);
  
  .submit-btn {
    width: 100%;
    height: 88rpx;
    line-height: 88rpx;
    background: linear-gradient(135deg, #007AFF, #1989fa);
    color: #fff;
    font-size: 32rpx;
    border-radius: 44rpx;
    
    &[disabled] {
      background: #ccc;
    }
  }
}
</style> 