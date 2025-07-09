<script>
  import Vue from 'vue'
  import NoticeSocket from './common/NoticeSocket';
  import DocChatSocket from './common/DocChatSocket';
  export default {
    globalData: { // 使用 globalData 来保存全局数据
      statusBarHeight: 0,
      navBarHeight: 0
    },
    data() {
      return {
        local_version: '',
        userinfo:null,
      }
    },
    onLaunch: async function() {


      uni.getSystemInfo({
        success: (res) => {
          this.globalData.statusBarHeight = res.statusBarHeight;

          // 设置导航栏高度，默认值
          let navBarHeight = 44; // iOS设备上的经验值
          if (process.env.UNI_PLATFORM === 'android') {
            navBarHeight = 56; // Android设备上的经验值
          }
          this.globalData.navBarHeight = navBarHeight;
        },
        fail: (err) => {
          console.error('获取系统信息失败', err);
        }
      });

      this.loadSocketModules()

      // const updateManager = wx.getUpdateManager()

      // updateManager.onCheckForUpdate(function (res) {
      //   // 请求完新版本信息的回调
      //   console.log(res.hasUpdate)
      // })

      // updateManager.onUpdateReady(function () {
      //   wx.showModal({
      //     title: '更新提示',
      //     content: '新版本已经准备好，是否重启应用？',
      //     success(res) {
      //       if (res.confirm) {
      //         // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
      //         updateManager.applyUpdate()
      //       }
      //     }
      //   })
      // })

    },

    onShow: async function() {},
    methods: {
      loadSocketModules() {
        const noticeSocket = new NoticeSocket()
        Vue.prototype.$noticeSocket = noticeSocket

        const chatSocket = new DocChatSocket()
        Vue.prototype.$chatSocket = chatSocket
        noticeSocket.handle('通知', this.onReceiveNotice)

      },
      onReceiveNotice(data) {
        this.userinfo = uni.getStorageSync('userInfo');
        switch (data.MessageType) {
          case 'Notice_PatientJoined': {
            if (this.userinfo && this.userinfo.Type == 10001) {
              // 获取当前页面
              const pages = getCurrentPages();
              // 检查是否已经在目标页面
              const isAlreadyInVideoPage = pages[pages.length - 1].route === 'subpages/shipin/agora/mp'

              if (!isAlreadyInVideoPage) {
                // 显示确认弹窗
                uni.showModal({
                  title: '新患者接入',
                  content: '有新的患者等待接诊，是否立即前往视频问诊？',
                  confirmText: '立即前往',
                  cancelText: '稍后处理',
                  success: (res) => {
                    if (res.confirm) {
                      uni.navigateTo({
                        url: '/subpages/shipin/agora/mp?Id=' + data.ExtData.Id
                      })
                    } else {
                      // 用户选择稍后处理，可以在这里执行其他操作
                      console.log('用户选择稍后处理')
                    }
                  }
                })
              } else {
                console.log('已经在视频页面，不重复跳转')
              }
            }
            break;
          }
        }
      }
    }
  }
</script>

<style lang="scss">
  @import '@/uni_modules/uni-scss/index.scss';
  @import "./common/index.scss";
  /* #ifndef APP-PLUS-NVUE */
  /* uni.css - 通用组件、模板样式库，可以当作一套ui库应用 */
  @import './common/uni.css';

  /* H5 兼容 pc 所需 */
  /* #ifdef H5 */
  @media screen and (min-width: 768px) {
    body {
      overflow-y: scroll;
    }
  }

  /* 顶栏通栏样式 */
  /* .uni-top-window {
	    left: 0;
	    right: 0;
	} */

  uni-page-body {
    background-color: #F5F5F5 !important;
    min-height: 100% !important;
    height: auto !important;
  }

  .uni-top-window uni-tabbar .uni-tabbar {
    background-color: #fff !important;
  }

  .uni-app--showleftwindow .hideOnPc {
    display: none !important;
  }

  /* #endif */

  /* 以下样式用于 hello uni-app 演示所需 */
  page {
    background-color: #f6f6f6;
    height: 100%;
    font-size: 28rpx;
    /* line-height: 1.8; */
  }

  .fix-pc-padding {
    padding: 0 50px;
  }

  .uni-header-logo {
    padding: 30rpx;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 10rpx;
  }

  .uni-header-image {
    width: 100px;
    height: 100px;
  }

  .flex-cs {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .flex {
    display: flex;
  }

  .align-center {
    align-items: center;
  }

  .flex-1 {
    flex: 1;
  }

  .flex-wrap {
    flex-wrap: wrap;
  }

  .bors {
    border-bottom: 1rpx solid #eee;
    padding-bottom: 20rpx;
    margin-bottom: 20rpx;
  }

  button {
    border: none;
    margin: 0;
    padding: 0;
    line-height: normal;
  }

  .flex-warp {
    flex-wrap: wrap;
  }

  .flex-end {
    justify-content: flex-end;

  }

  .search-btn {
    background: #00AA6C;
    border-radius: 50rpx;
    font-weight: 500;
    font-size: 26rpx;
    color: #FFFFFF;
    padding: 15rpx 35rpx;
  }

  .text-center {
    text-align: center;
  }

  input {
    width: 100%;
  }

  .pad-30 {
    padding: 30rpx;
  }

  .pad-20 {
    padding: 20rpx;
  }

  .gap-50 {
    gap: 50rpx;
  }

  .gap-40 {
    gap: 40rpx;
  }

  .gap-30 {
    gap: 30rpx;
  }

  .gap-20 {
    gap: 20rpx;
  }

  .gap-10 {
    gap: 10rpx;
  }

  .pad-btm-50 {
    padding-bottom: 50rpx;
  }

  .pad-btm-40 {
    padding-bottom: 40rpx;
  }

  .margin-right-50 {
    margin-right: 50rpx;
  }

  .margin-top-10 {
    margin-top: 10rpx;
  }

  .margin-top-15 {
    margin-top: 15rpx;
  }

  .margin-top-20 {
    margin-top: 20rpx;
  }

  .margin-bottom-20 {
    margin-bottom: 20rpx;
  }

  .margin-top-30 {
    margin-top: 30rpx;
  }

  .margin-top-40 {
    margin-top: 40rpx;
  }

  .margin-top-50 {
    margin-top: 50rpx;
  }

  .fff {
    background: #fff;
  }

  .border-radius-10 {
    border-radius: 10rpx;
  }

  .border-radius-20 {
    border-radius: 20rpx;
  }

  .font-32 {
    font-size: 32rpx;
  }

  .font-35 {
    font-size: 35rpx;
  }

  .font-40 {
    font-size: 40rpx;
  }

  .font-50 {
    font-size: 50rpx;
  }

  .font-60 {
    font-size: 60rpx;
  }

  .font-bold {
    font-weight: bold;
  }


  /* #endif*/
</style>