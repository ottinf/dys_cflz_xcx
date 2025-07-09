<template>
	<view>
		<header-bar @updatePadding="setPagePadding" tit="设置"></header-bar>
		<view :style="{ paddingTop: pagePadding + 'px' }"></view>

		<uni-section title="基础信息" type="line">
			<uni-list :border="false">
				<uni-list-item direction="column">
					<template v-slot:header>
						<view>角色</view>
					</template>
					<template v-slot:body>
						<view style="width: 100%;display: flex;flex-wrap: wrap;gap: 5rpx;">
							<view class="tag" v-for=" (item,index) in RoleNameList ">
								{{item.FullName}}
							</view>
						</view>
					</template>
				</uni-list-item>
				<uni-list-item direction="column">
					<template v-slot:header>
						<view>手机号</view>
					</template>
					<template v-slot:body>
						{{userInfo.MobilePhone}}
					</template>
				</uni-list-item>
				<uni-list-item direction="column">
					<template v-slot:header>
						<view>工作状态</view>
					</template>
					<template v-slot:body>
						<uni-data-checkbox mode="tag" v-model="userInfo.WorkStatus" :localdata="WorkStatusMap" wrap
							@change="change()"></uni-data-checkbox>
					</template>
				</uni-list-item>
				<uni-list-item title="修改密码">
				</uni-list-item>
				<uni-list-item v-if="allowTest" direction="column">
					<template v-slot:header>
						<view>跳转链接</view>
					</template>
					<template v-slot:body>
						<view style="width: 100%;display: flex;">
							<input v-model="testdata.customUrl" placeholder="" style="width: calc(100% - 140rpx);" />
							<button size="mini" type="primary" style="width: 120rpx;margin-left: 10rpx;"
								@click="toWebView()">进入</button>
						</view>
					</template>
				</uni-list-item>
				<uni-list-item v-if="allowTest" direction="column">
					<template v-slot:header>
						<view>激励广告测试</view>
					</template>
					<template v-slot:body>
						<view style="width: 100%;display: flex;">
							<input v-model="testdata.adUnitId" placeholder="" style="width: calc(100% - 140rpx);" />
							<button size="mini" type="primary" style="width: 120rpx;margin-left: 10rpx;"
								@click="toAdTest()">进入</button>
						</view>
					</template>
				</uni-list-item>
				<uni-list-item direction="column">
					<template v-slot:header>
						<view>{{IsBound ? '已' : '' }}绑定小程序</view>
					</template>
					<template v-slot:body>
						<view style="width: 100%;display: flex;">
							<button v-if="IsBound" size="mini" type="primary"  @click="unBindWxOpen()"
								style="width: 120rpx;height: 52rpx; margin-left: 10rpx;padding: 0 10rpx;"
								>解绑</button>
                <button v-else size="mini" type="primary" @click="bindWxOpen()"
                	style="width: 120rpx;height: 52rpx; margin-left: 10rpx;padding: 0 10rpx;"
                	>绑定</button>
						</view>
					</template>
				</uni-list-item>
				<uni-list-item direction="column">
					<template v-slot:header>
						<view>接诊通知</view>
					</template>
					<template v-slot:body>
						<view style="width: 100%;display: flex;">
							<button size="mini" type="primary" v-if="IsSubscribeNewPatient" @click="subscribeNewPatient()"
								style="width: 120rpx;height: 52rpx; margin-left: 10rpx;padding: 0 10rpx;">订阅</button>
                <button size="mini" type="primary" v-else class="tag" 
                style="width: 120rpx;height: 52rpx;margin-left: 10rpx;padding: 0 10rpx;">已订阅</button>
						</view>
					</template>
				</uni-list-item>
			</uni-list>
		</uni-section>

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
				userInfo: {
					WorkStatus: 0,
					Type: -1,
					Role: '',
				},
				RoleNameList: [],
				pagePadding: 0,
				WorkStatusMap: [],
				allowTest: false,
				testdata: {
					adUnitId: 'adunit-eb829114b9e2c4b2',
					customUrl: 'https://api.d1she.cn/adtest.html?id=1',
					authResult: '',
				},
        IsSubscribeNewPatient:false,
				IsBound: false
			};
		},
		async created() {
			this.WorkStatusMap = this.$dict.get('dic_work_status').filter(i => i.id >= 0).map(i => ({
				...i,
				value: i.id,
				text: i.name,
				disable: !(i.id === 0 || i.id === 10000)
			}))
			this.userInfo = uni.getStorageSync('userInfo');
			this.allowTest = this.userInfo.Role.includes('administrators')
      await this.getRole()
			await this.getWorkStatus()
      this.getIsBound()
      this.getSubscribedTemplete()
		},
		methods: {
			async getWorkStatus() {
				try {
					let res = await this.$api.user.GetWorkStatus()
					this.userInfo.WorkStatus = res.ResData.WorkStatus
				} catch (e) {
					console.log(e)
				}
			},
      async getIsBound() {
      	try {
      		let res = await this.$api.user.IsBoundWxOpen()
      		this.IsBound = res.ResData.Bound
      	} catch (e) {
      		console.log(e)
      	}
      },
      async getSubscribedTemplete() {
				try {
					const res = await new Promise((resolve, reject) => {
						wx.getSetting({
							withSubscriptions:true,
							success: (res) => resolve(res),
							fail: (err) => reject(err)
						});
					});
          let subscribeResult = Object.keys(res.subscriptionsSetting.itemSettings)
          console.log('所有订阅:', subscribeResult);
          if(subscribeResult.indexOf('ZIE7iVwr0CfYtnw2FM0znmnv2qMdlkTT34gJvTZpArk'))
            this.IsSubscribeNewPatient=true
				} catch (error) {
					console.error('获取订阅失败:', error);
				}
      },
			async getRole() {
				try {
					let res = await this.$api.role.GetSelfRole()
					this.RoleNameList = res.ResData
				} catch (e) {
					console.log(e)
				}
			},
      async unBindWxOpen() {
      	try {
      		const res = await this.$api.user.UnBindWxOpen();
      		if (!res.Success) {
      			throw new Error(res.ErrMsg)
      		}
          this.IsBound=false
      		this.$modal.msgSuccess('解绑成功')
      	} catch (error) {
      		this.$modal.alert(error.message, '解绑失败')
      	}
      },
			async bindWxOpen() {
        let res;
				try {
					res = await new Promise((resolve, reject) => {
						wx.login({
							success: (res) => resolve(res),
							fail: (err) => reject(err)
						});
					});
					console.log('bindWxOpen:wxlogin', res);
					if (!res.code) {
						throw new Error('授权登录失败:' + res.errMsg)
					}

					res = await this.$api.base.AfterToLogin({
						code: res.code
					});

					console.log('bindWxOpen:afterlogin', res);
					if (!res.Success) {
						throw new Error(res.ErrMsg)
					}
          this.IsBound=true
					this.$modal.msgSuccess('绑定成功')
				} catch (error) {
					this.$modal.alert(error.message, '绑定失败')
				}
			},
			async subscribeNewPatient() {
				try {
					const res = await new Promise((resolve, reject) => {
						wx.requestSubscribeMessage({
							tmplIds: ['ZIE7iVwr0CfYtnw2FM0znmnv2qMdlkTT34gJvTZpArk'],
							success: (res) => resolve(res),
							fail: (err) => reject(err)
						});
					});
					// 请求成功，输出结果
					console.log('微信订阅请求成功:', res);
					this.$modal.msgSuccess('订阅成功')
				} catch (error) {
					// 捕获异常，输出详细错误信息
					console.error('微信订阅请求失败:', error);
					this.$modal.alert(error.message, '订阅失败')
				}
			},
			async change() {
				let res = await this.$api.user.ChangeWorkStatus({
					Status: this.userInfo.WorkStatus
				})
				uni.showToast({
					title: res.ErrMsg,
					icon: res.Success ? 'success' : 'fail'
				})

			},
			setPagePadding(padding) {
				this.pagePadding = padding
			},
			goPage(url) {
				uni.navigateTo({
					url: url
				})
			},
			toWebView() {
				uni.navigateTo({
					url: '/subpages/webview/index?url=' + encodeURIComponent(this.testdata.customUrl)
				})
			},
			toAdTest() {
				uni.navigateTo({
					url: '/subpages/test/adTest?adUnitId=' + this.testdata.adUnitId
				})
			},
		}

	}
</script>

<style lang="scss" scoped>
	.cols {
		display: flex;
		flex-direction: column;
		font-weight: 400;
		font-size: 32rpx;
		color: #333333;
	}

	.tag {
		border-radius: 10rpx;
		background: #007aff;
		color: #fff;
		font-size: 24rpx;
		padding: 5rpx 10rpx;
		margin: 10rpx 10rpx 0 0;
	}
</style>