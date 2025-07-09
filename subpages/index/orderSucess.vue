<template>
  <view class="pages">
    <view class="card cols gap-30">
      <uni-icons type="checkbox-filled" size="80" color="#07c160"></uni-icons>
      <view class="font-35 font-bold">生成订单成功</view>
      <image :src="qrurl" class="codeimg"></image>
      <text>扫码查看订单</text>
    </view>
    <view class="bottom">
      <button class="btn" @click="goIndex" :plain="true" style="border: none;">返回首页</button>
    </view>
  </view>

</template>
<script>
  export default {
    data() {
      return {
        Id: -1,
        qrurl: '',
        patinfo: {},
      }
    },

    computed: {},
    async onLoad(opt) {
      try {
        this.Id = opt.Id;

        // 获取订单详情
        const orderDetailRes = await this.$api.order.OrderDetail({
          Id: this.Id
        });

        if (orderDetailRes.Success) {
          this.patinfo = orderDetailRes.ResData;
        } else {
          uni.showToast({
            title: orderDetailRes.ErrMsg,
            icon: 'none'
          });
        }

        // 获取医疗二维码
        const qrCodeRes = await this.$api.order.GetMedicalQRCode({
          Id: this.Id // 修复了这里的语法错误，将对象格式改为正确的键值对
        });

        if (qrCodeRes.Success) {
          this.qrurl = qrCodeRes.ResData.url;
        } else {
          uni.showToast({
            title: qrCodeRes.ErrMsg,
            icon: 'none'
          });
        }
      } catch (error) {
        // 添加错误处理
        console.error('加载数据时出错:', error);
        uni.showToast({
          title: '加载数据失败，请重试',
          icon: 'none'
        });
      }
    },

    onShow() {

    },
    methods: {
      goIndex() {
        uni.reLaunch({
          url: '/pages/index/index'
        })
      },


      goPage(url) {
        uni.navigateTo({
          url: url
        })
      }
    }
  }
</script>
<style>
  .pages {
    background: linear-gradient(to bottom, #d7f9ed, #f6f6f6);
    padding: 30rpx 50rpx;
  }

  text {
    color: #999;
    font-size: 28rpx;
    margin-top: 20rpx;
  }

  .card {
    background: #fff;
    border-radius: 10rpx;
    padding-top: 50rpx;
    padding-bottom: 150rpx;

  }

  .codeimg {
    width: 600rpx;
    height: 600rpx;
    margin: 20rpx 0;
  }

  .cols {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .bottom {
    position: fixed;
    bottom: 30rpx;
    left: 20rpx;
    right: 20rpx;
  }



  .btn {
    border-radius: 50rpx;
    margin-top: 10rpx;
    padding: 25rpx 0;
    border: none;
    font-size: 30rpx;
    background: #00AA6C !important;
    color: #fff !important;
  }
</style>