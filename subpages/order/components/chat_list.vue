<template>
  <scroll-view id="messageBox" class="parent-scroll" :scroll-top="scrollTop" scroll-y scroll-with-animation
    style="height: 100vh;">
    <view style="width: 100%;height: fit-content;display: flex;flex-direction: column;" id="messageList">
      <view v-for="(item, index) in list" :key="index" class="chat-item"
        :class="{'left': isSelfFunc(item), 'right': !isSelfFunc(item)}">
        <view class="chat-avatar" :class="{'hidden': !isSelfFunc(item)}">
          <uni-icons type="contact" size="60" style="line-height: 40px;" color="#b8b5ff" class="chat-icon"></uni-icons>
        </view>
        <view class="chat-content" :class="{'left': isSelfFunc(item), 'right': !isSelfFunc(item)}">
          <view v-if="item.MessageType===0" class="chat-text0">
            {{ item.Text }}
          </view>
          <view v-if="item.MessageType===201" class="chat-text0">
            <button class="btn-inchat" @click="jumpto('video')">
              <view class="btn-inchat-text">邀请对方加入视频(5分钟)</view>
            </button>
          </view>
          <view v-if="item.MessageType===301" class="chat-text0">
            <button class="btn-inchat">
              <view class="btn-inchat-text">问诊已结束</view>
            </button>
          </view>
        </view>
        <view class="chat-avatar" :class="{'hidden': isSelfFunc(item)}">
          <image v-if="userinfo.HeadIcon" :src="userinfo.HeadIcon" mode="aspectFit" webp :draggable="false"
            class="chat-image" @error=""></image>
          <uni-icons v-else type="contact" size="60" style="line-height: 40px;" color="#b8b5ff"
            class="chat-icon"></uni-icons>
        </view>
      </view>
      <view style="margin-top: 240rpx;">
      </view>
    </view>
    <view style="height: 240rpx;">
    </view>
  </scroll-view>

</template>

<script>
  export default {
    props: {
      list: {
        type: Array,
        default: () => []
      },
    },
    watch: {
      'list.length': {
        handler(val) {
          val && this.scrollBottom();
        },
        immediate: true,
      }
    },
    data() {
      return {
        userinfo: {},
        scrollTop: 0.0001,
      };
    },
    computed: {
      _parentStyle() {
        return {
          height: '100vh',
        };
      }
    },
    created() {
      this.userinfo = uni.getStorageSync('userInfo')
    },
    mounted() {
      setTimeout(() => {
        this.scrollBottom()
      }, 1000)
    },
    methods: {
      isSelfFunc(item) {
        return item && ((item.Session && item.Session.indexOf(item.SenderID) === 0) || item.FromType === 1);
      },

      async scrollBottom() {

        // 创建选择器查询
        const query = uni.createSelectorQuery().in(this);
        query.select('#messageList').boundingClientRect();
        query.select('#messageBox').boundingClientRect();
        // 等待查询执行完成并获取结果
        const res = await new Promise(resolve => {
          query.exec(result => {
            resolve(result);
          });
        });
        //console.log('res：', res);
        const height = res[0].height;
        console.log('获取到的高度：', height);

        // 延迟一帧后再次设置scrollTop确保滚动到底部
        this.$nextTick(() => {
          this.scrollTop = height + Math.random() + 200; //包括底部输入框和按钮组占的高度
        });
      },

      jumpto(data) {
        this.$emit('onclick', data)
      },
    }
  }
</script>

<style lang="scss">
  .parent-scroll {
    width: 100%;
    overflow-y: scroll;
  }

  .chat-item {
    margin: 10rpx 0;
    width: 100%;
    height: fit-content;
    display: flex;
  }

  .chat-item.left {
    /* 左侧样式 */
  }

  .chat-item.right {
    /* 右侧样式 */
  }

  .chat-item .chat-avatar {
    width: 100rpx;
    height: 100rpx;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    //justify-content: center;
    align-items: center;
  }

  .chat-avatar .chat-image {
    border-radius: 50%;
    border: 2px solid #b8b5ff;
    width: 40px;
    height: 40px;
  }

  .chat-avatar .chat-icon {
    display: flex;
    justify-content: center;
    width: 40px;
    margin-top: 8rpx;
  }

  .chat-item .chat-content {
    width: calc(100% - 200rpx);
    height: fit-content;
    padding-bottom: 20rpx;
    display: flex;
  }

  .chat-content.left {
    flex-direction: row;
  }

  .chat-content.right {
    flex-direction: row-reverse;
  }

  .chat-content .chat-text0 {
    @include text-wrap;
    background-color: rgba(170, 85, 127, 0.2);
    padding: 20rpx;
    margin: 0 20rpx;
    border-radius: 20rpx;
    max-width: calc(100% - 80rpx);
    width: fit-content;
  }

  .btn-inchat {
    width: fit-content;
    padding: 10rpx 20rpx;
    height: fit-content;
    margin-left: 20rpx;
    background-color: #75a5ff;
    border-radius: 30rpx;
    border: 1px solid #75a5ff;

    &:active {
      background-color: #5578b9;
    }
  }

  .btn-inchat-text {
    width: 100%;
    height: 40rpx;
    line-height: 40rpx;
    text-align: center;
    font-size: 26rpx;
    font-weight: bold;
    color: #ffffff;
  }
</style>