<template>
  <view>
    <header-bar tit="添加订单" @updatePadding="setPagePadding"></header-bar>
    <view class="pad-30 pages" :style="{ paddingTop: pagePadding + 15 + 'px' }">
      <view class="flex-cs bors" @click="verify">
        <view style="width: 140px;"><span>*</span>补充药品</view>
        <view class="flex align-center gap-10">
          <view class="nine" v-if="medicineNameComputed">{{ medicineNameComputed }}</view>
          <view v-else class="addbtn">去添加</view>
        </view>
      </view>
      <view class="flex bors">
        <view style="width: 140rpx;">问诊类型</view>
        <radio-group @change="patsystypeChange"
          style="flex-wrap: wrap;flex-direction: column;margin-left: 40rpx;flex: 1;">
          <label class="flex align-center" v-for="(item, index) in items" :key="item.value" v-if="item.show"
            style="margin: 10rpx 0;">
            <view>
              <radio color="#2a76fe" :value="item.value" :checked="item.value == data.PatSysType" />
            </view>
            <view>{{ item.name }}</view>
          </label>
        </radio-group>
      </view>
      <view class="flex bors">
        <view style="width: 140rpx;">医疗类别</view>
        <radio-group @change="medtypeChange" style="flex-wrap: wrap;flex-direction: column;margin-left: 40rpx;flex: 1;">
          <label class="flex align-center" v-for="(item, index) in medtypeList" :key="item.value" v-if="item.show"
            style="margin: 10rpx 0;">
            <view>
              <radio color="#2a76fe" :value="item.value" :checked="item.value == data.Med_type" />
            </view>
            <view>{{ item.name }}</view>
          </label>
        </radio-group>
      </view>
      <view class="bors" @click="verify2">
        <view class="flex-cs">
          <view><span>*</span>选择病症</view>
          <view class="addbtn">去添加</view>
        </view>
        <view v-if="data.Diagnoses.length > 0">
          <view class="tags " v-for="(i, index) in data.Diagnoses" :key="index">{{ i.MC }}</view>
        </view>
      </view>
      <uni-collapse>
        <uni-collapse-item title="主诉" :open="true">
          <view class="borders">
            <textarea v-model="data.ChiefComplaint" maxlength="140" placeholder="请输入"></textarea>
            <view class="text-right">{{ data.ChiefComplaint.length }}/ 140</view>
          </view>
        </uni-collapse-item>
        <uni-collapse-item title="现病史" :open="true">
          <view class="borders">
            <textarea v-model="data.CurrentHistory" maxlength="140" placeholder="请输入"></textarea>
            <view class="text-right">{{ data.CurrentHistory.length }}/ 140</view>
          </view>
        </uni-collapse-item>
        <uni-collapse-item title="既往史" :open="true">
          <view class="borders">
            <textarea v-model="data.OldHistory" maxlength="140" placeholder="请输入"></textarea>
            <view class="text-right">{{ data.OldHistory.length }}/ 140</view>
          </view>
        </uni-collapse-item>
        <uni-collapse-item title="过敏史" :open="true">
          <view class="borders">
            <textarea v-model="data.AllergyHistory" maxlength="140" placeholder="请输入"></textarea>
            <view class="text-right">{{ data.AllergyHistory.length }}/ 140</view>
          </view>
        </uni-collapse-item>
      </uni-collapse>
      <view class="bottom">
        <button class="btn" @click="confirm" :plain="true" style="border: none;">订单推送</button>
      </view>
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

        data: {
          Id: 0, //患者id
          PatSysType: 2, // 患者系统类型,1图文问诊,2视频问诊
          Med_type: 0, // 医保类型,0非医保,140104门诊慢病处方,140201门诊特病处方
          MobilePhone: '', // 患者手机号
          AllergyHistory: '无', // 过敏史
          ChiefComplaint: '无', // 主诉
          CurrentHistory: '无', // 现病史
          OldHistory: '无', // 既往史
          Note: '无', // 备注
          Diagnoses: [], // 诊断信息列表
          O_RecipeDetailList: [] // 处方明细列表
        },
        medicineName: '',
        items: [{
            value: 1,
            name: '图文问诊',
            show: false
          },
          {
            value: 2,
            name: '视频问诊',
            show: true
          },
        ],
        medtypeList: [{
            value: 0,
            name: '非流转处方',
            show: true
          },
          {
            value: 11,
            name: '普通门诊处方',
            show: false
          },
          {
            value: 140104,
            name: '慢病处方',
            show: false
          },
          {
            value: 140201,
            name: '特病处方',
            show: false
          },
        ]
      }
    },

    computed: {
      selectedMedicinesCount() {
        if (this.$store.state.current.med_list) {
          return this.$store.state.current.med_list.length;
        }
      },
      medicineNameComputed() {
        return this.selectedMedicinesCount > 0 ?
          `已选择 ${this.selectedMedicinesCount} 种药品` :
          '';
      }

    },
    onLoad() {


    },
    onShow() {

      if (this.$store.state.current.med_list && this.$store.state.current.med_list.length > 0) {
        this.medicineName = `已选择 ${this.$store.state.current.med_list.length} 种药品`
        this.data.O_RecipeDetailList = this.$store.state.current.med_list
      }
      if (this.$store.state.current.diag_list.length > 0) {
        this.data.Diagnoses = this.$store.state.current.diag_list
      }

    },
    methods: {
      patsystypeChange(e) {
        this.data.PatSysType = e.detail.value
      },
      medtypeChange(e) {
        this.data.Med_type = e.detail.value
      },
      setPagePadding(padding) {
        this.pagePadding = padding
      },
      confirm() {
        if (!this.data.O_RecipeDetailList.length) {
          return uni.showToast({
            title: '请选择药品',
            icon: 'none'
          })
        }
        if (!this.data.Diagnoses.length) {
          return uni.showToast({
            title: '请选择病症',
            icon: 'none'
          })
        }
        this.$api.order.PushOrder(this.data).then(res => {
          if (res.Success) {
            uni.showToast({
              title: res.ErrMsg,
              icon: 'none'
            })
            uni.reLaunch({
              url: '/subpages/index/orderSucess?Id=' + res.ResData.Id
            })

          } else {
            uni.showToast({
              title: res.ErrMsg,
              icon: 'none'
            })

          }
        })
      },
      // 选择药品
      verify() {
        uni.navigateTo({
          url: '/subpages/index/chooseMedicine'
        })
      },
      // 选择病症
      verify2() {
        uni.navigateTo({
          url: '/subpages/index/addDiagnoses'
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
<style lang="scss" scoped>
  ::v-deep .uni-collapse-item__title-box {
    padding: 0 !important;
  }


  ::v-deep .uni-collapse-item__title-text {
    font-size: 32rpx !important;
  }

  .radio {
    margin-right: 20rpx;
  }

  .addbtn {
    border-radius: 50rpx;
    color: #2a76fe;
    border: 1rpx solid #2a76fe;
    padding: 10rpx 30rpx;
  }

  .tags {
    color: #fff;
    background: #1689f7;
    padding: 5rpx 10rpx;
    font-size: 24rpx;
    display: inline-block;
    border-radius: 10rpx;
    margin-right: 15rpx;
    margin-top: 10rpx;
  }


  .borders {
    border: 1rpx solid #eee;
    border-radius: 10rpx;
    padding: 20rpx;

    textarea {
      height: 80rpx;
    }

    .text-right {
      text-align: right;
      color: #999;
    }
  }

  .pages {
    background: #fff;
    font-size: 32rpx;
    padding-bottom: 200rpx;
  }


  .bottom {
    position: fixed;
    bottom: 30rpx;
    left: 20rpx;
    right: 20rpx;
    z-index: 999;
  }


  .btn {
    margin-top: 10rpx;
    padding: 25rpx 0;
    border: none;
    border-radius: 50rpx;
    font-size: 30rpx;
    background: #00AA6C !important;
    color: #fff !important;
  }

  .nine {
    color: #808080;
  }
</style>