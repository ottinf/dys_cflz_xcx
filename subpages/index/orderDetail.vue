<template>
  <view>
    <header-bar @updatePadding="setPagePadding" tit="订单详情" :showLeft="true" :showHome="false"></header-bar>
    <view class="pages pad-30 cols gap-30" :style="{ paddingTop: pagePadding + 15 + 'px' }" v-if="data">
      <view class="font-60">{{ StatusName }}</view>
      <view class="card fff">
        <view class="flex align-center">
          <image class="codeimg" :src="img" @click="preview"></image>
          <view class="flex-1 cols gap-20">
            <view class="flex-cs">
              <view class="font-40 font-bold">{{ data.Name }}</view>
              <view class="font-30 font-bold">{{ data.Gender == '1' ? '男' : '女' }}&nbsp;&nbsp;丨&nbsp;&nbsp;{{ data.Age
              }}岁
              </view>
            </view>
            <view>手机号码：<text>{{ data.MobilePhone }}</text></view>
            <view>身份证号：<text>{{ data.IDCard }}</text></view>
          </view>
        </view>
        <view class="margin-top-20 aaa">问诊时间：{{ data.CreateDate }}</view>
      </view>
      <view class="card fff">
        <view class="font-35 font-bold pad-btm-40">诊断</view>
        <view class="flex flex-warp gap-30 tags">
          <view v-for="(i, index) in data.Diagnoses" :key="index">{{ i.MC }}</view>
        </view>
      </view>
      <!-- 处方类型 -->
      <view class="card fff">
        <view style="width: 100%; display: flex;justify-content: space-between;align-items: center;">
          <view class="font-35 font-bold">处方类型</view>
          <view @click="toRecipePreview" v-if="data.Status == 90000" style="color: #6078ff;"> 处方预览</view>
        </view>
        <view class="flex flex-warp gap-30 tags" style="margin-top: 40rpx;">
          <view style="font-weight: bold; color: red; font-size: 40rpx;">
            {{
              data.Med_type === 0 ? '非流转处方' :
                data.Med_type === 11 ? '普通门诊处方' :
                  data.Med_type === 140104 ? '慢病处方' :
                    data.Med_type === 140201 ? '特病处方' : '未知处方类型'
            }}
          </view>
        </view>
      </view>
      <view class="card fff">
        <view class="font-35 font-bold pad-btm-40">药品信息</view>
        <view class="cols">
          <view class="flex-cs bors" v-for="(i, index) in mList" :key="index">
            <view style=" width: 100%;">
              <view style="display: flex; justify-content: space-between;">
                <view class="font-35 ">{{ i.MedName }} </view>
                <template v-if="$privilege.asUserType('Doctor')">
                  <view style="display: flex; ">
                    <view v-if="data.Status != 90000" class="del" @click="del(i.Id)">删除</view>
                    <view v-if="data.Status != 90000" class="edit" @click="edit(i.Id, index)">编辑</view>
                  </view>

                </template>
              </view>
              <view>
                <view class="margin-top-10 flex flex-statr" style="justify-content: space-between;flex-wrap: wrap;">
                  <view style="display: flex; width: 100%;">
                    <uni-icons type="calendar" size="25" color="#03a9f4"></uni-icons>
                    <view class="methods">{{ i.UseWayDesc }}，{{ i.UseIntervalDesc }}，一次{{ i.UseQty }}{{ i.UseQtyUnit }}
                    </view>
                  </view>

                  <view class="flex" style="width: 100%; text-align: center; display: flex;justify-content: flex-end; ">
                    <view class="font-bold" style="color: #ef7a14;">{{ i.Amount }}{{ i.BigUnit
                    }}*{{ i.CnvValue }}{{ i.SmallUnit }} <span style="padding-left: 26rpx;">用药天数{{
                        i.UseIntervalDays }}天</span> </view>
                  </view>
                </view>

              </view>
            </view>

          </view>
        </view>
      </view>
      <view class="card fff">
        <view class="font-35 font-bold pad-btm-40">主诉</view>
        <view>{{ data.ChiefComplaint }}</view>
      </view>
      <view class="card fff">
        <view class="font-35 font-bold pad-btm-40">病史</view>
        <view class="cols gap-50">
          <view class="flex">
            <view class="font-bold font-32 wid-200 margin-right-50 underline height-40">现病史</view>
            <view class="flex-1">{{ data.CurrentHistory }}</view>
          </view>
          <view class="flex">
            <view class="font-bold font-32 wid-200 margin-right-50 underline height-40">既往史</view>
            <view class="flex-1">{{ data.OldHistory }}</view>
          </view>
          <view class="flex">
            <view class="font-bold font-32 wid-200 margin-right-50 underline height-40">过敏史</view>
            <view class="flex-1">{{ data.AllergyHistory }}</view>
          </view>
          <view class="flex">
            <view class="font-bold font-32 wid-200 margin-right-50 underline height-40">备注</view>
            <view class="flex-1">{{ data.Note }}</view>
          </view>
        </view>
      </view>

      <view class="card fff" v-if="data.Status == 90000">
        <view class="font-35 font-bold pad-btm-40">签名</view>
        <view class="cols gap-50">
          <view class="flex">
            <view class="font-bold font-32 wid-200 margin-right-50 underline height-40">审核签名</view>
            <view class="flex-1">
              <button class="bottom-btn" v-if="!data.IsDrugAudited" v-show="$privilege.hasRole('drug_audit_phar')"
                @click="DrugPharSign(20101, '审核')">审核签名</button>
              <view class="descripe-btn" v-else>已审核签名</view>
            </view>
          </view>
          <view class="flex">
            <view class="font-bold font-32 wid-200 margin-right-50 underline height-40">调配签名</view>
            <view class="flex-1">
              <button class="bottom-btn" v-if="!data.IsDrugDeployed" v-show="$privilege.hasRole('drug_deploy_phar')"
                @click="DrugPharSign(20201, '调配')">调配签名</button>
              <view class="descripe-btn" v-else>已调配签名</view>
            </view>
          </view>
          <!--          <view class="flex">
            <view class="font-bold font-32 wid-200 margin-right-50 underline height-40">复核签名</view>
            <view class="flex-1"> <button class="bottom-btn" v-if="!data.IsDrugReviewed"
                v-show="$privilege.hasRole('drug_review_phar')" @click="DrugPharSign(20301,'复核')">复核签名</button>
              <view class="descripe-btn"  v-else>已复核签名</view>
            </view>
          </view> -->
          <view class="flex">
            <view class="font-bold font-32 wid-200 margin-right-50 underline height-40">发药签名</view>
            <view class="flex-1">
              <button class="bottom-btn" v-if="!data.IsDrugConsigned" v-show="$privilege.hasRole('drug_consign_phar')"
                @click="DrugPharSign(20401, '发药')">发药签名</button>
              <view class="descripe-btn" v-else>已发药签名</view>
            </view>
          </view>
        </view>
      </view>

      <view v-if="1" class="bottombar">
        <view class="bottomcontainer">
          <button class="bottom-btn" v-show="ShowInquiryButton"
            @click="goPage(`/subpages/order/chat?Id=${id}&time=${data.CreateDate}`)">问诊</button>
          <!-- <button class="bottom-btn" v-show="ShowEndInquiryButton" @click="InquiryFinish()">结束问诊</button> -->
          <button class="bottom-btn" v-show="PassButton" @click="DoctorPass()">通过</button>
          <button class="bottom-btn red" v-show="NoPassButton" @click="DoctorNoPass()">不通过</button>
        </view>
        <view v-if="$privilege.asUserType('Doctor')" @click="backHome" class="backHome">返回订单列表</view>
      </view>
    </view>

    <view class="editCard" v-for="item in NewmList" v-if="editfrom">
      <view class="editItem">
        <view class="title">修改药品 </view>
        <view class="cont">
          <view class="item">服用方法
            <uni-data-select style="width: 400rpx;  margin-left:30rpx ;font-size: 35rpx; " v-model="wayValue"
              :localdata="dictUseWay" @change="change" :clear="false"></uni-data-select>
          </view>
          <view class="item">服用频率
            <uni-data-select style="width: 400rpx;  margin-left:30rpx ;font-size: 35rpx; " v-model="valValue"
              :localdata="dictUseInterval" @change="valchange" :clear="false"></uni-data-select>
          </view>
          <view class="item">
            服用单位<input type="text" v-model="item.UseQty">/{{ item.UseQtyUnit }}
          </view>
          <view class="item">
            数量<input type="text" v-model="item.Amount">/{{ item.BigUnit }}
          </view>
        </view>
        <view class="btn">
          <view class="cancel" @click="editfrom = false">取消修改</view>
          <view class="sure" @click="sure">确定修改</view>
        </view>
      </view>
    </view>
  </view>

</template>
<script>
import dictionary from '../../utils/dictionary';
import modalUtil from '../../common/modalUtil.js'
import headerBar from '../../components/header-bar.vue';
export default {
  components: {
    headerBar
  },
  data() {
    return {
      pagePadding: 0,
      id: null,
      img: '',
      mList: [],
      data: {},
      UseWay: dictionary.dic_use_way,
      UseInterval: dictionary.dic_use_interval,
      StatusMap: dictionary.dic_patient_status_type,
      NewmList: [],
      editfrom: true,
      Wayindex: 0,
      Intervalindex: 0,
      dictUseWay: [],
      dictUseInterval: [],
      wayValue: 1,
      valValue: 1,
      waycode: null,
      valcode: null,
      index: null,
      previewRecipeUrl: ''
    }
  },

  computed: {
    StatusName() {
      return this.getStatusName(this.data && this.data.Status)
    },
    ShowInquiryButton() {
      return this.data && this.data.Status >= 30100 && this.data.Status < 30900 && this.$privilege.asUserType(
        'Doctor')
    },
    ShowEndInquiryButton() {
      return this.data && this.data.Status >= 30100 && this.data.Status < 30900 && this.$privilege.asUserType(
        'Doctor')
    },
    PassButton() {
      return this.data && this.$privilege.asUserType('Doctor') && (
        (this.data.Status >= 40000 && this.data.Status < 40900) ||
        (this.data.Status > -50000 && this.data.Status <= -40000)
      )
    },
    NoPassButton() {
      return this.data && this.$privilege.asUserType('Doctor') && (
        (this.data.Status >= 30000 && this.data.Status < 40900) ||
        (this.data.Status > -50000 && this.data.Status <= -40000)
      )
    },
  },
  onLoad(opt) {
    this.dictUseWay = this.$dict.get('dic_use_way')
    this.dictUseInterval = this.$dict.get('dic_use_interval')
    this.dictUseWay = this.dictUseWay.map(item => ({
      ...item,
      value: item.id,
      text: item.name
    }))
    this.dictUseInterval = this.dictUseInterval.map(item => ({
      ...item,
      value: item.id,
      text: item.name
    }))
    this.id = opt.Id;
    this.data.Status = opt.status
    this.$api.order.OrderDetail({
      Id: this.id
    }).then(res => {
      if (res.Success) {
        this.data = res.ResData;
        this.previewRecipeUrl = `https://api.d1she.cn/api/Deyishe/O_RecipeDetail/ShowRecipeToPublic?id=${this.id}&sign_type=all`
      } else {
        uni.showToast({
          title: res.ErrMsg,
          icon: 'none'
        })
      }
    })
    this.getMlist();
    this.$api.order.GetMedicalQRCode({
      Id: this.id
    }).then(res => {
      if (res.Success) {
        this.img = res.ResData.url;
      } else {
        uni.showToast({
          title: res.ErrMsg,
          icon: 'none'
        })
      }
    })

  },
  onShow() {

  },
  methods: {
    // 
    backHome() {
      uni.switchTab({ url: '/pages/order/order' })
    },
    toRecipePreview() {
      uni.navigateTo({
        url: '/subpages/webview/index?url=' + encodeURIComponent(this.previewRecipeUrl)
      })
    },
    getMlist() {
      this.$api.order.OrderRecipe({
        Id: this.id
      }).then(res => {
        console.log(res, 'res')
        if (res.Success) {
          this.mList = res.ResData.map(item => ({
            ...item,
            UseWayDesc: this.findNameByCode(this.UseWay, item.UseWay),
            UseIntervalDesc: this.findNameByCode(this.UseInterval, item.UseInterval)
          }));
        } else {
          uni.showToast({
            title: res.ErrMsg,
            icon: 'none'
          })
        }
      })
    },
    sure() {
      this.$api.order.SaveWhenInquiry({
        Id: this.id,
        AllergyHistory: this.data.AllergyHistory,
        ChiefComplaint: this.data.ChiefComplaint,
        CurrentHistory: this.data.CurrentHistory,
        OldHistory: this.data.OldHistory,
        Note: this.data.Note,
        Diagnoses: this.data.Diagnoses,
        O_RecipeDetailList: this.mList
      }).then(res => {
        console.log(res)
        if (res.Success) {
          uni.showToast({
            title: res.ErrMsg,
          })
          this.getMlist();
        }
      })

      this.editfrom = false

    },
    change(e) {
      this.dictUseWay.filter(v => {
        if (v.id === e) {
          return this.waycode = v.code
        }
      })
      this.NewmList[0].UseWay = this.waycode
    },
    valchange(e) {
      this.dictUseInterval.filter(v => {
        if (v.id === e) {
          return this.valcode = v.code
        }
      })
      console.log(this.valcode)
      this.NewmList[0].UseInterval = this.valcode

    },
    edit(id, index) {
      console.log(this.$privilege.asUserType('Doctor'))
      console.log(this.data)
      console.log(this.NewmList, 'NewmList')
      this.index = index
      this.editfrom = true
      this.NewmList = this.mList.filter(v => {
        return v.Id === id
      })
      console.log(this.NewmList, 'NewmList')
      let arr = this.dictUseWay.filter(v =>
        this.NewmList.some(vv => v.code === vv.UseWay)
      );
      let array = this.dictUseInterval.filter(v =>
        this.NewmList.some(vv => v.code === vv.UseInterval)
      );
      console.log(arr, 'arr', array, 'array')
      this.wayValue = arr[0].value
      this.valValue = array[0].value

    },
    //删除药品
    del(Id) {
      // 是否确定删除药品
      uni.showModal({
        title: '提示',
        content: '是否确定删除药品',
        success: (res) => {
          if (res.confirm) {
            if (this.mList.length <= 1) {
              uni.showToast({
                title: '至少保留一个药品',
                icon: 'none'
              })
              return
            }
            console.log(this.mList, 'mList')
            let index = this.mList.findIndex(v => v.Id === Id)
            this.mList.splice(index, 1)
            this.$api.order.SaveWhenInquiry({
              Id: this.data.Id,
              AllergyHistory: this.data.AllergyHistory,
              ChiefComplaint: this.data.ChiefComplaint,
              CurrentHistory: this.data.CurrentHistory,
              OldHistory: this.data.OldHistory,
              Note: this.data.Note,
              Diagnoses: this.data.Diagnoses,
              O_RecipeDetailList: this.mList
            }).then(res => {
              console.log(res)
              if (res.Success) {
                uni.showToast({
                  title: res.ErrMsg,
                })
              }
              this.getMlist();
            })
          } else if (res.cancel) {
            console.log('用户点击取消');
          }
        }
      })
    },
    setPagePadding(padding) {
      this.pagePadding = padding;
    },
    findNameByCode(array, code) {
      const item = array.find(item => item.code === code);
      return item ? item.name : '未知';
    },
    getStatusName(status) {
      const item = this.StatusMap.find(item => item.value === status);
      return item ? item.name : '未知';
    },
    preview() {
      uni.previewImage({
        urls: [this.img],
        current: 0
      });
    },
    async DrugPharSign(signtype, optname) {
      let yes = await modalUtil.showModalAsync({
        title: '确认操作',
        content: `确认对当前订单进行${optname}并签名吗?`
      })
      if (!yes) return
      let res = await this.$api.sign.DrugPharSign({
        SignType: signtype,
        Id: this.data.Id
      })
      if (res.Success) {
        switch (signtype) {
          case 20101: // DrugAuditSign
            this.data.IsDrugAudited = true;
            break;
          case 20201: // DrugDeploySign
            this.data.IsDrugDeployed = true;
            break;
          case 20301: // DrugReviewSign
            this.data.IsDrugReviewed = true;
            break;
          case 20401: // DrugConsignSign
            this.data.IsDrugConsigned = true;
            break;
          default:
        }
        return this.$modal.msgSuccess(`${optname}成功`)
      } else {
        return modalUtil.showModalAsync({
          title: `${optname}失败`,
          content: `原因:${res.ErrMsg}`
        })
      }
    },
    // async InquiryFinish() {
    //   let ensure = await this.$modal.showModal({
    //     title: '确认',
    //     content: '是否确认结束问诊?'
    //   })
    //   if (!ensure.confirm)
    //     return

    //   let res = await this.$api.order.InquiryFinish({
    //     Id: this.data.Id
    //   })
    //   if (res.Success) {
    //     //更新当前订单状态
    //     this.data.Status = res.ResData.Status
    //     this.$modal.msgSuccess('成功结束当前问诊')
    //   }
    //   else {
    //     this.$modal.alert('结束问诊失败')
    //   }

    // },
    async DoctorPass() {
      let ensure = await this.$modal.showModal({
        title: '确认',
        content: '是否确认提交?'
      })
      if (!ensure.confirm)
        return

      let res = await this.$api.order.DoctorPass({
        Id: this.data.Id
      })

      if (res.Success) {
        //更新当前订单状态
        this.data.Status = res.ResData.Status
        this.$modal.msgSuccess('成功提交')
        //1秒后跳转
        setTimeout(() => {
          uni.reLaunch({ url: `/pages/order/order` })
        }, 1000)
      }
      else {
        this.$modal.alert('通过提交')
      }
    },
    async DoctorNoPass() {
      let ensure = await this.$modal.showModal({
        title: '确认',
        editable: true,
        placeholderText: '请输入不通过的原因'
      })
      if (!ensure.confirm)
        return

      let res = await this.$api.order.DoctorNoPass({
        Id: this.data.Id,
        Note: ensure.content
      })

      if (res.Success) {
        //更新当前订单状态
        this.data.Status = res.ResData.Status
        this.data.Note = ensure.content
        this.$modal.msgSuccess('成功不通过')
        setTimeout(() => {
          uni.reLaunch({
            url: `/pages/order/order`
          })
        }, 1000)
      }
      else {
        this.$modal.alert('提交失败')
      }
    },
    goPage(url) {
      uni.navigateTo({
        url: url + '?time=' + this.data.CreateTime
      })
    }
  }
}
</script>
<style lang="scss">
.pages {
  padding-bottom: 200rpx;
}

.bottombar {
  background: #fff;
  position: relative;
  width: calc(100% - 60rpx);
  height: fit-content;
  padding: 30rpx;
  border-radius: 10rpx;
  display: flex;
  justify-content: space-between;
}

.backHome {
  border: 2rpx solid #0038aa;
  color: #003db8;
  background-color: #d2f0f8;
  font-weight: bold;
  border-radius: 10rpx;
  text-align: center;
  padding: 6rpx 20rpx;
  display: flex;
  align-items: center;
}

.bottombar .bottomcontainer {
  // width: calc(100% - 60rpx);
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 20rpx;
  overflow-y: scroll;
}

.bottom-btn {
  border: 2rpx solid #0038aa;
  color: #003db8;
  background-color: #d2f0f8;
  font-weight: bold;
  border-radius: 10rpx;
  width: fit-content;
  text-align: center;
  padding: 6rpx 20rpx;
}

.bottom-btn.red {
  border: 2rpx solid #ff0004;
  color: #ff0004;
}

.bottom-btn.yellow {
  border: 2rpx solid #9c974c;
  color: #9c974c;
}

.descripe-btn {
  background-color: transparent;
  border: none;
  color: #7996ff;
  width: fit-content;
  text-align: center;
  padding: 10rpx 20rpx;
}

.bors:last-of-type {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.height-40 {
  height: 40rpx;
}

.trash-btn {
  border-radius: 10rpx;
  padding: 10rpx;
  background: #fe0034;
  margin-left: 40rpx;
}

.underline {
  position: relative;
  z-index: 1;

  &::after {
    content: '';
    position: absolute;
    bottom: -5rpx;
    left: 0;
    right: 0;
    height: 8rpx;
    width: 100%;
    background: #0dc7f8;
    z-index: -1;
  }
}

.aaa {
  color: #7e7e7e;
}

.cols {
  display: flex;
  flex-direction: column;
}

.card {
  border-radius: 20rpx;
  padding: 20rpx 30rpx;
}

.codeimg {
  width: 100rpx;
  height: 100rpx;
  margin-right: 30rpx;
}

.edit,
.del {
  color: #E6A23C;
  font-size: 35rpx;

}

.del {
  color: red;
  margin-right: 20rpx;
}

.methods {
  font-size: 40rpx;
  color: red;
}

.font-35 {
  font-weight: bold;
  font-size: 35rpx;
}

.font-bold {
  font-size: 35rpx;

}


.editCard {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  padding: 20rpx 15rpx;
  border: 1rpx solid #000;
  z-index: 999;
  box-shadow: 2px 4px 10px rgba(0, 0, 0, 0.3);
  background: #fff;
  border-radius: 15rpx;
  .editItem {
    padding: 25rpx 30rpx;


    .title {
      font-weight: bold;
      padding: 20rpx 0;
    }

    .cont {
      padding: 25rpx 0;

      .item {
        display: flex;
        align-items: center;
        padding: 15rpx 0;
        font-size: 35rpx;

        input {
          margin: 0 20rpx;
          width: 15%;
          text-align: center;
          border: 1rpx solid #bdb9b9;
        }
      }
    }

    .btn {
      padding-top: 70rpx;
      display: flex;
      justify-content: space-between;

      .cancel {
        background: #909399 !important;
      }

      .sure,
      .cancel {
        background: #67C23A;
        color: #fff;
        padding: 10rpx 20rpx;
        border-radius: 15rpx;
      }
    }

  }
}

movable-view {
  width: 50% !important;
  height: calc(100vh - 70%)!important;
}
</style>