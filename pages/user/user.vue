<template>
  <view class="pages">
    <view class="topcard">
      <image class="bgimg" src="https://api.d1she.cn/miniapp/navimg/mycon.png"></image>
      <view class="top-fix">
        <view class="text-center">我的</view>
        <view class="flex-cs margin-top-40">
          <view class="flex">
            <image class="img" :src="userInfo.HeadIcon"></image>
            <view style="color: #fff;">
              <view>{{ userInfo.RealName }} {{ userInfo.MobilePhone }}</view>
              <view class="margin-top-15 gap-30 flex align-center" v-show="$privilege.asUserType('Doctor')">
                <view>
                  状态：{{ WorkStatus }}
                </view>
                <switch color="#007aff" :checked="status" @change="switch2Change" />
              </view>
            </view>
          </view>
          <uni-icons type="gear" @click="goPage('/subpages/user/setting')" size="35" color="#fff"></uni-icons>
        </view>
      </view>
    </view>
    <view class="card" style="margin: 30rpx;">
      <view class="bors">合作机构({{ mList.length > 0 ? mList.length : 0 }})</view>
      <view class="flex bors align-center" v-for="(i, index) in mList" :key="index">
        <image class="img blue" :src="i.HeadIcon"></image>
        <view>
          <view>{{ i.FullName }}</view>
          <view class="flex align-center">
            <view class="tag orange" v-if="i.isHost">默认合作机构</view>
            <view class="tag green" v-if="i.isSelf">本机构</view>
            <view class="tag">区划{{ i.AreaId }}</view>
          </view>
        </view>
      </view>
    </view>
    <button @click="logout" class="btn-logout">退出登录</button>
    <uni-popup ref="alertDialog" type="dialog">
      <uni-popup-dialog cancelText="取消" confirmText="确认" title="提示" content="确定退出登录吗？" @confirm="dialogConfirm"
        @close="dialogClose"></uni-popup-dialog>
    </uni-popup>
  </view>
</template>
<script>
export default {
  data() {
    return {
      userInfo: {},
      mList: [],
      imgUrl: '',
      status: false,
      WorkStatus: ''
    }
  },
  onLoad() {
    this.getStatus()
  },
  onShow() {
    this.getJG()
  },
  computed: {
  },
  methods: {
    getStatus() {
      this.$api.user.GetWorkStatus().then(res => {
        if (res.Success) {
          if (res.ResData.WorkStatus == 10000) {
            this.status = true
            this.WorkStatus = '工作中'
          } else {
            this.status = false
            this.WorkStatus = '休息中'
          }
        }
      })
    },
    async change(value) {
      let res = await this.$api.user.ChangeWorkStatus({
        Status: value
      })
      uni.showToast({
        title: res.ErrMsg,
        icon: res.Success ? 'success' : 'fail'
      })

    },
    switch2Change(e) {
      const value = e.detail.value ? 10000 : 0;
      this.change(value).then(() => {
        // 确保在change操作完成之后再更新状态
        this.getStatus();
      }).catch(err => {
        console.error("Failed to change work status:", err);
      });
    },
    async getJG() {
      this.userInfo = uni.getStorageSync('userInfo');
      this.userInfo.HeadIcon = this.$utilDo.getMedia(this.userInfo.HeadIcon)
      try {
        // 获取用户信息
        const userRes = await this.$api.user.GetUserInfo();
        if (userRes.Success) {
          this.userInfo = {
            ...this.userInfo,
            ...userRes.ResData,
            HeadIcon: this.$utilDo.getMedia(this.userInfo.HeadIcon),
          };
        }
        uni.setStorageSync('userInfo', this.userInfo)
        this.$store.dispatch('current/setUserInfo', this.userInfo)
        // 获取合作机构
        const coopOrgsRes = await this.$api.organize.GetCoopOrgs();
        if (coopOrgsRes.Success) {
          this.mList = coopOrgsRes.ResData.map(i => ({
            ...i,
            isSelf: this.userInfo.DeptId === i.Id,
            isHost: this.userInfo.HostOrganize && this.userInfo.HostOrganize.Id === i.Id,
            HeadIcon: this.$utilDo.getMedia(i.HeadIcon),
          }));
          this.mList.sort((a, b) => {
            if (a.isSelf === b.isSelf) {
              // 如果 isSelf 相同，则根据 isHost 排序
              return b.isHost - a.isHost; // isHost 为 true 的在前
            }
            return b.isSelf - a.isSelf; // isSelf 为 true 的在前
          });
        }

      } catch (error) {
        console.error("请求出错:", error);
        uni.showToast({
          title: '请求失败，请稍后重试',
          icon: 'none',
        });
      }
    },
    logout() {
      this.$refs.alertDialog.open()
    },
    dialogConfirm() {
      uni.showLoading({
        title: '正在退出',
        mask: true
      }).then(() => {
        setTimeout(() => {
          uni.hideLoading()
          this.$api.user.Logout().finally(res=>{
            uni.removeStorageSync('token')
            uni.removeStorageSync('userInfo')
            
            uni.reLaunch({
              url: '/pages/login/login'
            })
          })

        }, 1000)
      }).catch(() => {
        console.log('loading fail')

      })
    },
    dialogClose() {
      console.log('点击关闭')
    },
    goPage(url) {
      uni.navigateTo({
        url
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.topcard {
  position: relative;
  font-weight: 500;
  font-size: 32rpx;
  color: #333333;

  .bgimg {
    width: 100%;
    height: 350rpx;
  }

  .top-fix {
    position: absolute;
    left: 30rpx;
    right: 30rpx;
    top: 110rpx;
  }
}

.tag {
  border-radius: 10rpx;
  background: #007aff;
  color: #fff;
  font-size: 24rpx;
  padding: 5rpx 10rpx;
  margin: 10rpx 10rpx 0 0;
}

.card .flex.bors:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.orange {
  background: #f8ae3e;
}

.green {
  background-color: #5aee39;
}

.blue {
  border: 1rpx solid #007aff;
}

.card {
  border-radius: 20rpx;
  padding: 40rpx 30rpx;
  background: #fff;
  margin-bottom: 120rpx;
  height: calc(100vh - 700rpx);
  overflow-y: auto;
}

.img {
  border-radius: 50%;
  width: 100rpx;
  height: 100rpx;
  margin-right: 30rpx;
  border: 1rpx solid #fff;
}

.col {
  display: flex;
  flex-direction: column;
  margin-top: 30rpx;
  gap: 20rpx;
  font-size: 28rpx;
}

.col text {
  color: #999;
  font-size: 26rpx;
}

.col .tit {
  width: 120rpx;
  padding-left: 10rpx;
}

.b1 {
  background: #007aff;
  color: #fff;
  font-size: 30rpx;
  padding: 10rpx 30rpx;
}

.btn-logout {
  position: fixed;
  bottom: 120rpx;
  left: 30rpx;
  right: 30rpx;
  height: 88rpx;
  background: #00AA6C;
  border-radius: 8rpx;
  line-height: 88rpx;
  font-weight: bold;
  font-size: 28rpx;
  color: #FFFFFF;
}
</style>