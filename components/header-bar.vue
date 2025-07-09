<template>
    <view>
        <view :style="{ paddingTop: localStatusBarHeight + 'px', height: localNavBarHeight + 'px',background:background }"
            class="header flex align-center">
            <view v-if="showLeft" @click="onClickLeft" style="padding-left: 20rpx;">
                <uni-icons type="left" size="30"></uni-icons>
            </view>
            <view v-if="showHome" @click="onClickHome" style="padding-left: 20rpx;">
                <uni-icons type="home" size="30"></uni-icons>
            </view>
            <view class="flex-1 text-center">{{ tit }}</view>
        </view>
    </view>
</template>

<script>
export default {
    name: "navbar",
    props: {
        tit: {
            type: String,
            default: ''
        },
        showLeft: {
            type: Boolean,
            default: true
        },
        showHome: {
            type: Boolean,
            default: false
        },
        background:{
          type: String,
          default: `url('https://api.d1she.cn/miniapp/navimg/navimg.png')`
        }
    },
    data() {
        const app = getApp();
        return {
            localStatusBarHeight: app.globalData.statusBarHeight || 0,
            localNavBarHeight: app.globalData.navBarHeight || 44,
        };
    },
    mounted() {
        const app = getApp();
        this.localStatusBarHeight = app.globalData.statusBarHeight || this.localStatusBarHeight;
        this.localNavBarHeight = app.globalData.navBarHeight || this.localNavBarHeight;
        this.$emit('updatePadding', this.localStatusBarHeight + this.localNavBarHeight);
    },
    methods: {
        onClickLeft() {
            uni.navigateBack();
        },
        onClickHome() {
            uni.switchTab({
                url: '/pages/index/index'
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.header {
    background-size: 100% 100%;
    background-repeat: no-repeat;
    font-family: PingFang SC;
    font-weight: 500;
    font-size: 36rpx;
    color: #1A1A1A;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 999;

}

.header .flex-1.text-center {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
}
</style>