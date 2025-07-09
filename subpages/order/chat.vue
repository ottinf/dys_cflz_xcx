<template>
  <view style="width: 100vw;height: 100vh;display: block;position: absolute;">
    <view style="background: #fff;  position: fixed; top: 0rpx; width: 100%; z-index: 999;">
      <view class="row-card" style="justify-content: space-between;">
        <view class="row-full-left" style="align-items: self-end;height: 40rpx;">
          <view style="font-size: 36rpx;color: #3acabc;font-weight: bold;height: 40rpx;line-height: 40rpx;">处方流转</view>
          <view style="font-size: 30rpx;color: #000;margin-left: 10rpx;height: 40rpx;line-height: 40rpx;">处方药复诊开方服务
          </view>
        </view>
        <view class="row-full-between" style="margin: 10rpx 0;">
          <view class="text-normal-info">
            <uni-icons type="checkbox-filled" size="20" color="#2df3bb"></uni-icons>医生资质审核
          </view>
          <view class="text-normal-info">
            <uni-icons type="checkbox-filled" size="20" color="#2df3bb"></uni-icons>处方安全保障
          </view>
          <view class="text-normal-info">
            <uni-icons type="checkbox-filled" size="20" color="#2df3bb"></uni-icons>平台双重质检
          </view>
        </view>
      </view>
    </view>
    <chatListVue :list="list" @onclick="handleClick" :time="patinfo"></chatListVue>
    <view class="bottom-fixed">
      <view style="padding: 20rpx;display: flex; justify-content: space-between;">
        <input type="text" v-model="input.text" :maxlength="50" placeholder="请输入内容"
          style="width: calc(100% - 240rpx);height: 60rpx; padding-left: 25rpx;">
        <button class="btn-send" @click="_send()">
          <view class="btn-send-text">发送</view>
        </button>
      </view>
      <view style="padding:20rpx 20rpx 10rpx;display: flex;">
        <button class="btn-opeitem" @click="_sendInviteVideo()">
          <view class="btn-opeitem-text">邀请加入视频</view>
        </button>
      </view>
    </view>
  </view>
</template>
<script>
import chatListVue from './components/chat_list.vue'
import DocChatSocket from '@/utils/DocChatSocket'
var counter = 0
var chatSocket = null
export default {
  data() {
    return {
      patinfo: {
        Id: 0,
        time: '',
      },
      chathead: null,
      list: [],
      state: false,
      data: {
        id: 175
      },
      input: {
        text: '',
      },
      chatdata: {
        to_online: false,//患者是否在线
      }
    }
  },
  components: {
    chatListVue
  },
  async onLoad(option) {
    if (!option.Id) return
    this.patinfo.Id = option.Id
    this.patinfo.time = option.time
    await this.getChatList()

  },
  methods: {
    open() {
      this.state = !this.state
    },
    async getChatList() {
      let res = await this.$api.chat.DoctorGetMessage({
        Id: this.patinfo.Id,
      })
      this.chathead = res.ResData
      this.list = res.ResData.Details

      //连接聊天
      if (!chatSocket)
        chatSocket = new DocChatSocket()
      if (chatSocket) {
        //已经加入到聊天频道，修改患者状态
        chatSocket.handle('chat', this.handleChatMessage)
        chatSocket.handle('send_back', this.handleChatMessage)
      }
    },
    togovideo() { },
    async handleClick(data) {
      if (data === 'video') {
        if (this.patinfo.Status >= 30900) {
          return uni.showModal({
            title: '提示',
            content: '无需重复视频问诊',
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定');
              } else if (res.cancel) {
                console.log('用户点击取消');
              }
            }
          });
        }

        uni.navigateTo({
          url: '/subpages/shipin/agora/mp?Id=' + this.patinfo.Id
        })
      }
    },
    async _sendInviteVideo() {
      //调用接口
      let res = await this.$api.chat.DoctorSendMessage({
        Id: this.patinfo.Id,
        Type: 201,
        Text: '邀请加入视频'
      })
      if (res.Success) {
        this.list.push({
          ...res.ResData,
          FromType: 2,
          MessageType: 0,
        })
        uni.navigateTo({
          url: '/subpages/shipin/agora/mp?Id=' + this.patinfo.Id
        })
      };
    

    },
    async _send() {
      let text = this.input.text
      this.input.text = ''
      if (!text)
        return
      //调用接口
      let res = await this.$api.chat.DoctorSendMessage({
        Id: this.patinfo.Id,
        Type: 0,
        Text: text
      })
      if (res.Success) {
        this.list.push({
          ...res.ResData,
          FromType: 2,
          MessageType: 0,
        })
      }
      //由于DoctorSendMessage接口会自动向对方传递信息，所以无需手动传
    },
    handleChatMessage(data) {
      switch (data.MessageType) {
        case 200: {
          this.chatdata.to_online = data.Status == 101
          break;
        }
        case 201: {
          this.list.push({
            ...data,
          })
        }
        case 301: {
          this.list.push({
            ...data,
          })
        }
        case 0: {
          if (!data.Code || data.Code == '-')
            break;
          this.list.push({
            ...data,
          })
          break;
        }
        default:
          break;
      }
    },
  },


}
</script>
<style lang="scss" scoped>
.text-normal-info {
  font-size: 24rpx;
  color: #28cfb1;
  display: flex;
  align-items: center;
}

.row-full {
  width: 100%;
}

.btn-send {
  width: 140rpx;
  height: 60rpx;
  background-color: #3acabc;
  border-radius: 20rpx;

  &:active {
    background-color: #299086;
  }
}

.btn-send-text {
  width: 100%;
  height: 100%;
  line-height: 60rpx;
  text-align: center;
  font-size: 32rpx;
  font-weight: bold;
  color: #fff;
}

.btn-opeitem {
  width: fit-content;
  padding: 10rpx 20rpx;
  height: fit-content;
  margin-left: 10rpx;
  border-radius: 15rpx;
  background: #2d351b;

  &:active {
    background-color: #eaf7f7;
  }
}

.btn-opeitem-text {
  width: 100%;
  height: 40rpx;
  line-height: 40rpx;
  text-align: center;
  font-size: 26rpx;
  font-weight: bold;
  color: #fff;
}

.bottom-fixed {
  position: fixed;
  bottom: 0rpx;
  width: 100%;
  height: fit-content;
  display: flex;
  flex-direction: column-reverse;
  background-color: #fff;
}

.row-full-between {
  align-items: center;
}
</style>