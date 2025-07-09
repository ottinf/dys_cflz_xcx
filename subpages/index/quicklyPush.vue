<template>
  <view>
    <header-bar tit="图文问诊" @updatePadding="setPagePadding"></header-bar>
    <view class="pad-30 pages" :style="{ paddingTop: pagePadding + 15 + 'px' }">
      <view class="flex-cs bors">
        <view><span>*</span>姓名</view>
        <view class="flex-1 flex">
          <input type="text" v-model="data.Name" placeholder="请输入就诊人姓名">
          <button class="b1" @click="goPage('/subpages/index/choosePeople')">选择患者</button>
        </view>
      </view>
      <view class="flex-cs bors">
        <view>身份证号</view>
        <input type="idcard" v-model="data.IDCard" placeholder="请输入身份证号">
      </view>
      <view class="flex-cs bors">
        <view>性别</view>
        <view class="flex align-center gap-10">
          <view v-if="data.Gender">
            {{ data.Gender == '1' || data.Gender == '男' ? '男' : '女' }}
          </view>
          <view v-else>
            性别
          </view>
        </view>
      </view>
      <view class="flex-cs bors">
        <view>年龄</view>
        <view v-if="data.Age">
          {{ data.Age }}
        </view>
        <view v-else>
          年龄
        </view>
      </view>
      <view class="flex-cs bors">
        <view>出生日期</view>
        <view class="flex align-center gap-10">
          <view v-if="data.Birthday">
            {{ data.Birthday }}
          </view>
          <view v-else>
            生日
          </view>
        </view>
      </view>
      <view class="flex-cs bors">
        <view>联系电话</view>
        <input type="number" v-model="data.MobilePhone" placeholder="请输入联系电话">
      </view>
      <view class="flex-cs bors" @click="verify">
        <view><span>*</span>选择药品</view>
        <view class="flex align-center gap-10">
          <view class="nine"> {{ medicineNameComputed }} </view>
          <uni-icons type="right" size="18" color="#999"></uni-icons>
        </view>
      </view>
      <view class="bors" @click="verify2">
        <view class="flex-cs">
          <view><span>*</span>选择确诊病症</view>
          <view class="add">去添加</view>
        </view>
        <view v-if="data.Diagnoses.length > 0">
          <view class="tags " v-for="(i, index) in data.Diagnoses" :key="index">{{ i.MC }}</view>
        </view>
      </view>
      <view class="flex-cs bors">
        <view>是否复诊</view>
        <view class="flex align-center gap-20 radios">
          <view @click="toogleOne('否')" :class="{ active: toogle1 == '否' }">否</view>
          <view @click="toogleOne('是')" :class="{ active: toogle1 == '是' }">是</view>
        </view>
      </view>
      <view class="flex-cs">
        <view>是否有过敏史</view>
        <view class="flex align-center gap-20 radios">
          <view @click="toogleTwo('无')" :class="{ active: toogle2 == '无' }">无</view>
          <view @click="toogleTwo('有')" :class="{ active: toogle2 == '有' }">有</view>
        </view>
      </view>
      <view class="bottom">
        <checkbox-group @change="checkboxChange">
          <label class="radio">
            <checkbox value="cb" :checked="true" color="#1788f7" style="transform:scale(0.7)" />已阅读 <text
              class="t1">《患者问诊服务协议》</text>和<text class="t1">《隐私政策》</text>
          </label>
        </checkbox-group>
        <button class="btn" @click="confirm" :plain="true" style="border: none;" :disabled="disabled">提交</button>
      </view>
    </view>
  </view>

</template>
<script>
import IDCardUtil from '@/common/IDCardUtil'
import StringHelper from '@/common/StringHelper'
import headerBar from '@/components/header-bar.vue'
export default {
  components: {
    headerBar
  },
  data() {
    return {
      pagePadding: 0,
      disabled: true,
      toogle1: '否',
      toogle2: '无',
      data: {
        Id: 0,
        Name: '',
        Age: '',
        Gender: '',
        MobilePhone: '',
        IDCard: '',
        Birthday: '',
        OldHistory: '',
        ChiefComplaint: '',
        CurrentHistory: '',
        AllergyHistory: '',
        Note: '',
        Diagnoses: [],
        O_RecipeDetailList: []
      },
      agreementChecked: false, // 是否勾选了协议
    }
  },
  watch: {
    'data.IDCard': {
      immediate: true,
      handler: function (val) {
        if (IDCardUtil.isValid(val)) {
          this.data.Gender = IDCardUtil.getGender(val)
          this.data.Age = IDCardUtil.getAge(val)
          this.data.Birthday = IDCardUtil.getBirthDate(val)
          this.$forceUpdate()
        }
      }
    },
    'data.Name': 'updateSubmitButtonState',
    'data.MobilePhone': 'updateSubmitButtonState',
    'data.idNumber': 'updateSubmitButtonState',
    'data.Diagnoses': 'updateSubmitButtonState'
  },
  computed: {
    selectedMedicinesCount() {
      if (this.$store.state.current.med_list) {
        return this.$store.state.current.med_list.length;
      }
    },
    medicineNameComputed() {
      return this.selectedMedicinesCount > 0
        ? `已选择 ${this.selectedMedicinesCount} 种药品`
        : '';
    }
  },
  onLoad() {


  },
  onShow() {

    if (this.$store.state.current.patInfo) {
      this.data = {
        ...this.data,
        ...this.$store.state.current.patInfo
      }
      this.data.Birthday = this.data.Birthday ? this.data.Birthday.substring(0, 10) : this.data.Birthday
      console.log(this.data.Gender);
      this.data.Diagnoses = []
      // this.data.OldHistory = ''
      // this.data.ChiefComplaint = ''
      // this.data.CurrentHistory = ''
      // this.data.AllergyHistory = ''
      // this.data.Note = ''
      // this.data.O_RecipeDetailList = []

    }
    if (this.$store.state.current.med_list.length > 0) {
      console.log(this.$store.state.current.med_list)
      this.data.O_RecipeDetailList = this.$store.state.current.med_list
    }
    if (this.$store.state.current.diag_list.length > 0) {
      this.data.Diagnoses = this.$store.state.current.diag_list
    }



  },
  methods: {
    // 验证姓名 手机号
    validateForm(name, phone) {

      if (!StringHelper.isChineseName(name)) {
        uni.showToast({
          title: '姓名格式不正确，请输入正确的中文姓名',
          icon: 'none'
        });
        return false;
      }

      if (!StringHelper.isPhoneNumber(phone)) {
        uni.showToast({
          title: '手机号格式不正确，请输入11位数字的手机号',
          icon: 'none'
        });
        return false;
      }
      return true;
    },
    // 监听身份证输入
    parseIdNumber(event) {
      const idNumber = event.target.value;
      this.data.idNumber = idNumber;

      if (IDCardUtil.isValid(idNumber)) {
        this.data.Gender = IDCardUtil.getGender(idNumber);
        this.data.Birthday = IDCardUtil.getBirthDate(idNumber);
        this.data.Age = IDCardUtil.getAge(idNumber);
      } else {

      }
    },

    setPagePadding(padding) {
      this.pagePadding = padding
    },
    //提交表单
    confirm() {
      //修改药品的id，作为处方内的药品id，不能有值
      this.data.O_RecipeDetailList.forEach(item => {
        item.Id = 0;
      })

      const validationResult = this.validateForm(this.data.Name, this.data.MobilePhone);
      if (!validationResult) return;
      wx.showLoading({
        title: '正在保存中...',
        mask: true
      })
      this.$api.order.PushAllinOne(this.data).then(res => {
        wx.hideLoading()
        if (res.Success) {
          console.log(res);
          uni.reLaunch({
            url: '/subpages/order/serve?Id=' + res.ResData.opr.Id
          })
        } else {
          uni.showToast({
            title: res.ErrMsg,
            icon: 'none'
          })
        }
      }).catch(e => {
        wx.hideLoading()
      })
    },
    // 选择药品
    verify() {
      if (this.data.Name && this.data.MobilePhone && this.data.IDCard) {
        uni.navigateTo({
          url: '/subpages/index/chooseMedicine'
        })
      } else {

        uni.showToast({
          title: '请补全信息',
          icon: 'none'
        })
      }
      this.updateSubmitButtonState();

    },
    // 选择病症
    verify2() {
      if (this.selectedMedicinesCount) {
        uni.navigateTo({
          url: '/subpages/index/addDiagnoses'
        })
      } else {

        uni.showToast({
          title: '请选择药品',
          icon: 'none'
        })
      }
      this.updateSubmitButtonState();

    },
    //
    checkboxChange(e) {
      this.agreementChecked = e.detail.value.includes('cb');
      this.updateSubmitButtonState();
    },
    updateSubmitButtonState() {
      const dataFilled = this.data.Name && this.data.MobilePhone && this.data.IDCard;
      const requiredConditionsMet = dataFilled && !!this.medicineNameComputed && this.data.Diagnoses.length > 0;
      this.disabled = !requiredConditionsMet;
    },
    toogleOne(value) {
      this.toogle1 = value
    },
    toogleTwo(value) {
      this.toogle2 = value
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
page {
  background: #fff;
}

.pages {
  padding-bottom: 200rpx;
}

.add {
  border-radius: 50rpx;
  padding: 10rpx 20rpx;
  color: #1689f7;
  font-size: 28rpx;
  border: 1rpx solid #1689f7;
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

.radios view {
  border: 1rpx solid #ccc;
  border-radius: 50rpx;
  padding: 6rpx 40rpx;
  color: #808080;
}

.radios view.active {
  border-color: #1689f7;
  color: #1689f7;
}

.bottom {
  position: fixed;
  bottom: 30rpx;
  left: 20rpx;
  right: 20rpx;
}

.radio {
  font-size: 24rpx;

}

.t1 {
  color: #1689f7;
}

.btn {
  margin-top: 10rpx;
  padding: 25rpx 0;
  border: none;
  font-size: 30rpx;
  background: #00AA6C !important;
  color: #fff !important;
}

button[disabled] {
  background: #999999 !important;
}

.nine {
  color: #808080;
}

.b1 {
  color: #fff;
  background: #1789f8;
  font-size: 26rpx;
  margin-left: 10rpx;
  padding: 10rpx;
}

input {
  flex: 1;
  text-align: right;
}

span {
  color: red;
}
</style>