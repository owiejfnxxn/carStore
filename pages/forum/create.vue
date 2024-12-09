<template>
  <view class="create-container">
    <view class="nav-bar">
      <text class="cancel" @tap="handleCancel">取消</text>
      <text class="title">发布帖子</text>
      <text class="publish" :class="{ disabled: !canPublish }" @tap="handlePublish">发布</text>
    </view>
    
    <view class="edit-area">
      <input 
        class="title-input"
        v-model="postForm.title"
        placeholder="请输入标题"
        maxlength="50"
      />
      <textarea
        class="content-input"
        v-model="postForm.content"
        placeholder="分享你的故事..."
        maxlength="2000"
      />
      
      <!-- 图片上传区域 -->
      <view class="image-upload">
        <view class="image-list">
          <view 
            class="image-item" 
            v-for="(img, index) in postForm.images" 
            :key="index"
          >
            <image :src="img" mode="aspectFill"/>
            <text class="delete-btn" @tap.stop="deleteImage(index)">×</text>
          </view>
          <view 
            class="upload-btn"
            v-if="postForm.images.length < 9"
            @tap="chooseImage"
          >
            <text class="iconfont icon-add">+</text>
            <text class="tip">{{postForm.images.length}}/9</text>
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
      postForm: {
        title: '',
        content: '',
        images: []
      }
    }
  },
  computed: {
    canPublish() {
      return this.postForm.title.trim() && this.postForm.content.trim()
    }
  },
  methods: {
    handleCancel() {
      if (this.postForm.title || this.postForm.content || this.postForm.images.length) {
        uni.showModal({
          title: '提示',
          content: '是否放弃编辑？',
          success: (res) => {
            if (res.confirm) {
              uni.navigateBack()
            }
          }
        })
      } else {
        uni.navigateBack()
      }
    },
    
    // 选择图片
    chooseImage() {
      uni.chooseImage({
        count: 9 - this.postForm.images.length,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          this.postForm.images = [...this.postForm.images, ...res.tempFilePaths]
        },
        fail: () => {
          uni.showToast({
            title: '选择图片失败',
            icon: 'none'
          })
        }
      })
    },
    
    // 删除图片
    deleteImage(index) {
      uni.showModal({
        title: '提示',
        content: '确定要删除这张图片吗？',
        success: (res) => {
          if (res.confirm) {
            this.postForm.images.splice(index, 1)
          }
        }
      })
    },
    
    // 发布帖子
    handlePublish() {
      if (!this.canPublish) return
      
      // 构建新帖子数据
      const newPost = {
        id: Date.now(), 
        username: '当前用户', 
        avatar: 'https://via.placeholder.com/300x200',
        time: new Date().toLocaleString(),
        title: this.postForm.title,
        content: this.postForm.content,
        images: this.postForm.images,
        likes: 0,
        comments: 0,
        isLiked: false,
        isFollowed: false
      }
      
      // 同步到列表页
      try {
        const pages = getCurrentPages()
        const prevPage = pages[pages.length - 2]
        if (prevPage && prevPage.$vm.postList) {
          // 添加到列表开头
          prevPage.$vm.postList.unshift(newPost)
          // 更新原始数据
          prevPage.$vm.originalPosts.unshift(newPost)
        }
        
        uni.showToast({
          title: '发布成功',
          icon: 'success'
        })
        
        setTimeout(() => {
          uni.navigateBack()
        }, 1500)
        
      } catch (e) {
        console.error('同步帖子数据失败:', e)
        uni.showToast({
          title: '发布失败',
          icon: 'none'
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.create-container {
  min-height: 100vh;
  background: #fff;
}

.nav-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 30rpx;
  border-bottom: 1rpx solid #eee;
  background: #fff;
  position: sticky;
  top: 0;
  z-index: 100;
  
  .cancel {
    font-size: 28rpx;
    color: #666;
    padding: 10rpx;
  }
  
  .title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
  }
  
  .publish {
    font-size: 28rpx;
    color: #007AFF;
    padding: 10rpx 20rpx;
    
    &.disabled {
      color: #999;
    }
  }
}

.edit-area {
  padding: 30rpx;
  
  .title-input {
    font-size: 32rpx;
    padding: 20rpx 0;
    border-bottom: 1rpx solid #eee;
  }
  
  .content-input {
    width: 100%;
    height: 300rpx;
    margin-top: 20rpx;
    font-size: 28rpx;
    line-height: 1.6;
  }
}

.image-upload {
  margin-top: 30rpx;
  
  .image-list {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20rpx;
    
    .image-item {
      position: relative;
      padding-bottom: 100%;
      background: #f5f5f5;
      border-radius: 8rpx;
      overflow: hidden;
      
      image {
        position: absolute;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      
      .delete-btn {
        position: absolute;
        right: 10rpx;
        top: 10rpx;
        width: 40rpx;
        height: 40rpx;
        line-height: 40rpx;
        text-align: center;
        background: rgba(0, 0, 0, 0.5);
        color: #fff;
        border-radius: 50%;
        font-size: 32rpx;
      }
    }
    
    .upload-btn {
      position: relative;
      padding-bottom: 100%;
      background: #f5f5f5;
      border-radius: 8rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      
      .icon-add {
        font-size: 60rpx;
        color: #999;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
      
      .tip {
        font-size: 24rpx;
        color: #999;
        position: absolute;
        bottom: 20rpx;
        left: 50%;
        transform: translateX(-50%);
      }
    }
  }
}
</style> 