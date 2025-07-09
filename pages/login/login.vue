<template>
  <view>
    <view class="screen-1">
      <image src="https://api.d1she.cn/favicon.ico" class="logo"></image>
      <view class="fff pad-20 border-radius-20">
        <view class="margin-bottom-20">手机号</view>
        <view class="flex align-center gap-20">
          <uni-icons type="person" size="30"></uni-icons>
          <input type="number" maxlength="11" v-model="form.UserCode" placeholder="请输入手机号" />
        </view>
      </view>
      <view class="fff pad-20 border-radius-20">
        <view class="margin-bottom-20">密码</view>
        <view class="flex align-center gap-20">
          <uni-icons type="locked" size="30"></uni-icons>
          <input password type="text" maxlength="20" v-model="form.PassCode" placeholder="请输入密码" />
        </view>
      </view>
      <view class="fff pad-20 border-radius-20">
        <view class="margin-bottom-20">验证码</view>
        <view class="flex align-center gap-20">
          <uni-icons type="paperplane" size="30"></uni-icons>
          <input class="flex-1" maxlength="4" type="text" v-model="form.ValidCode" placeholder="请输入验证码" />
          <image class="codeimg" :src="img" @click="getPicCode"></image>
        </view>
      </view>
      <button class="login" @click="login">登录</button>
      <!-- <view class="footer">
                <span>注册</span>
                <span>忘记密码?</span>
            </view> -->
    </view>
  </view>
</template>
<script>
  export default {
    data() {
      return {
        form: {
          Type: 1,
          UserCode: '',
          PassCode: '',
          ValidCode: '',
          VerifyCode: ''
        },
        img: ''
      }
    },
    onLoad() {
      this.getPicCode();
      let mobilephone = uni.getStorageSync('cur_MobilePhone')
      if (mobilephone && mobilephone.length == 11)
        this.form.UserCode = mobilephone
    },
    methods: {
      getPicCode() {
        this.$api.base.Captcha().then(res => {
          if (res.Success) {
            this.img = 'data:image/png;base64,' + res.ResData.Img
            this.form.VerifyCode = res.ResData.Key
          } else {
            uni.showToast({
              title: res.ErrMsg,
              icon: 'none'
            })
          }

        })
      },
      async login() {
        try {
          let res = await this.$api.user.Login(this.form);
          if (res.Success) {
            let userinfo = {
              ...res.ResData,
              HeadIcon: this.$utilDo.getMedia(res.ResData.HeadIcon)
            };

            uni.setStorageSync('cur_MobilePhone', res.ResData.MobilePhone);
            uni.setStorageSync('token', res.ResData.AccessToken);
            uni.setStorageSync('SocketToken', res.ResData.SocketToken);
            res=await this.$api.user.GetUserInfo();
            userinfo = {
              ...userinfo,
              ...res.ResData,
            }
            uni.setStorageSync('userInfo', userinfo);
            
            uni.reLaunch({
              url: '/pages/index/index'
            });
            this.subscribeMessage();
          } else {
            uni.showToast({
              title: res.ErrMsg,
              icon: 'none'
            });
          }
        } catch (error) {
          // 这里可以添加异常处理，比如网络错误等
          uni.showToast({
            title: '登录失败，请稍后再试',
            icon: 'none'
          });
          console.error('Login error:', error);
        }

      },
      subscribeMessage() {
      // #ifdef MP-WEIXIN
      uni.requestSubscribeMessage({
        tmplIds: ['ZIE7iVwr0CfYtnw2FM0znmnv2qMdlkTT34gJvTZpArk'], // 替换为实际模板ID
        success: (res) => {
          // 重点：检查用户是否同意
          if (res['ZIE7iVwr0CfYtnw2FM0znmnv2qMdlkTT34gJvTZpArk'] === 'accept') {
            console.log('用户同意订阅');
          }
        },
        fail: (err) => {
          console.error('订阅失败', err);
        }
      });
      // #endif
    },
    }
  }
</script>
<style lang="scss">
  page {
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(45deg, #97d8dc, #abda89, #4ebc5d);
    height: 100vh;
    font-size: 30rpx;
  }

  .codeimg {
    width: 180rpx;
    height: 80rpx;
  }

  .screen-1 {
    background: rgba($color: #fff, $alpha: 0.5);
    padding: 50rpx;
    display: flex;
    flex-direction: column;
    border-radius: 30px;
    gap: 40rpx;
    width: calc(100vw - 250rpx);
  }


  .logo {
    width: 120rpx;
    height: 120rpx;
    border-radius: 50rpx;
    text-align: center;
    margin: 30rpx auto 0;
  }


  .screen-1 .login {
    padding: 20rpx 0;
    background: #00AA6C;
    color: white;
    border: none;
    border-radius: 50rpx;
    font-weight: bold;
    font-size: 32rpx;
  }

  .screen-1 .footer {
    display: flex;
    justify-content: space-around;
    color: #5e5e5e;
  }
</style>