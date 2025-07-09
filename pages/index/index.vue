<template>
  <view class="pages">
    <header-bar @updatePadding="setPagePadding" tit="首页" :showLeft="false"></header-bar>
    <view :style="{ paddingTop: pagePadding + 'px' }"></view>
    <view class="tit margin-top-30">业务 <text>统计</text></view>
    <view class="flex flex-warp gap-40 pad-30">
      <view class="card" v-for="objkey in Object.keys(total)" :key="objkey">
        <view>{{ objkey }}已完成</view>
        <view><span>{{ total[objkey] }}</span>个</view>
      </view>
    </view>
    <view class="flex align-center gap-40 pad-30" v-show="$privilege.asUserType('DrugWorker')">
      <view class="flex-1" @click="goPage('/subpages/index/addOrder')">+添加订单</view>
      <view class="flex-1" @click="goPage('/subpages/index/quicklyPush')">快速推方</view>
    </view>
  </view>
</template>
<script>
  import headerBar from '@/components/header-bar.vue'
  export default {
    components: {
      headerBar
    },
    data() {
      return {
        pagePadding: 0,
        total: {
          "本日": 0,
          "昨日": 0,
          "本周": 0,
          "本月": 0,
          "本季": 0,
          "今年": 0
        },
        WorkStatus: ''
      }
    },
    onLoad() {
      this.getMsg();
      this.afterLogin();
      // this.sendSubscription();

    },
    onShow() {
      //在首页时，重置订单临时数据
      this.$store.state.current.patInfo = null
      this.$store.state.current.med_list = []
      this.$store.state.current.diag_list = []
    },
    methods: {
      //获取业务统计
      getMsg() {
        this.$api.base.QueryOrderTotal().then(res => {
          if (res.Success) {
            const {
              '视频-本日': _v1,
              '视频-本周': _v2,
              '视频-本月': _v3,
              ...rest
            } = res.ResData
            this.total = rest
          }
        })
      },
      //获取工作状态
      getStatus() {
        return this.$api.user.GetWorkStatus().then(res => {
          if (res.Success) {
            if (res.ResData.WorkStatus == 10000) {
              this.status = true;
              this.WorkStatus = '工作中';
            } else {
              this.status = false;
              this.WorkStatus = '休息中';
            }
          }
        });
      },
      async change(value) {
        let res = await this.$api.user.ChangeWorkStatus({
          Status: value
        })

      },
      afterLogin() {
        let userinfo = uni.getStorageSync('userInfo')
        if (userinfo.Type === 10001) {
          this.getStatus().then(() => {
            if (this.WorkStatus === '休息中') {
              uni.showModal({
                title: '提示',
                content: '您当前处于休息状态，是否要切换到工作状态？',
                confirmText: '切换状态',
                success: (res) => {
                  if (res.confirm) {
                    this.change(10000).then(() => {
                      this.getStatus();
                      uni.showToast({
                        title: '已切换',
                        icon: 'success'
                      });
                    }).catch(err => {
                      console.error('切换工作状态失败:', err);
                      uni.showToast({
                        title: '切换失败，请重试',
                        icon: 'none'
                      });
                    });
                  }
                }
              });
            }
          }).catch(err => {
            console.error('获取工作状态失败:', err);
          });
        }

      },

      setPagePadding(padding) {
        this.pagePadding = padding
      },
      goPage(url) {
        uni.navigateTo({
          url: url
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .flex-1 {
    text-align: center;
    background: linear-gradient(90deg, #01AB6D, #32E1A1);
    color: #fff;
    font-size: 32rpx;
    border-radius: 20rpx;
    padding: 50rpx;
    font-weight: bold;
  }

  .card {
    border-radius: 20rpx;
    background: #fff;
    padding: 40rpx 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20rpx;
    width: calc(50% - 22rpx);
    white-space: nowrap;

    span {
      font-weight: bold;
      font-size: 38rpx;
      color: #00AA6C;
    }
  }

  .tit {
    margin-left: 30rpx;
    padding-left: 15rpx;
    position: relative;
    font-weight: bold;
    font-size: 35rpx;
    color: #1A1A1A;

    &::after {
      content: '';
      position: absolute;
      width: 4rpx;
      height: 29rpx;
      background: #329262;
      border-radius: 2rpx;
      top: 50%;
      transform: translateY(-50%);
      left: 0;
    }

    text {
      color: #01AB6D;
    }
  }
</style>