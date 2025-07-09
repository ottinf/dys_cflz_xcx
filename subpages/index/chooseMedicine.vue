<template>
  <view class="pages">
    <header-bar @updatePadding="setPagePadding" tit="选择药品"></header-bar>
    <view class="flex-cs gap-30 pad-30 fff" :style="{ paddingTop: pagePadding + 15 + 'px' }">
      <view class="flex align-center flex-1 efef">
        <view class="flex align-center flex-1">
          <uni-icons type="search" size="20"></uni-icons>
          <input type="text" v-model="data.Keywords" placeholder="请输入关键字进行搜索">
        </view>
        <view class="search-btn" @click.stop="search(data.Keywords)">搜索</view>
      </view>
      <uni-icons type="scan" size="30"></uni-icons>
    </view>
    <view class="tips flex-cs">
      <view>温馨提示：药品搜索操作说明</view>
      <view class="underline" @click="showPop">点击查看</view>
    </view>
    <view v-if="data.Keywords" class="cols fff pad-20">
      <view class="bors" v-for="(i, index) in medicines">
        <view style="width: 100%;display: flex;justify-content: space-between;">
          <view style="color: #22363a;font-size: 32rpx;">{{ i.MedName }}
            <span v-if="i.GoodsNo">
              ({{i.GoodsNo}})
            </span>
          </view>
          <uni-number-box :step="1" v-model="i.Amount" @change="changeValueInList(i, $event)" />
        </view>
        <view style="width: 100%;display: flex;justify-content: space-between;">
          <view style="color: #95eeff;font-size: 26rpx;">{{ i.Code }}</view>
          <view style="color: #55d2ff;font-size: 26rpx;">{{ i.ApprovalNumber }}</view>
        </view>
        <view class="flex-cs">
          <view>
            {{i.MinSellPack}}*{{i.SmallUnit}}, {{ i.Specification }}
          </view>
        </view>
      </view>
    </view>
    <view v-else>
      <view class="flex-cs pad-20 grey fff">
        <view>历史搜索</view>
        <view @click="delAll">清空历史记录</view>
      </view>
      <view class="pad-20 cols fff" v-if="historyList.length > 0">
        <view class="flex-cs bors" v-for="(i, index) in historyList" :key="index" @click.stop.prevent="search(i)">
          <view>{{ i }}</view>
          <uni-icons type="trash" @click.native.stop="delItem(index)" :data-item="i" size="20" color="#999"></uni-icons>
        </view>
      </view>
    </view>
    <view class="text-center pad-20 nomore" v-if="more">没有更多了</view>

    <view class="footer fff" @click.stop="openCart(openCartStatus)">
      <view class="changebtn">
        <uni-icons v-if="openCartStatus" type="up" size="20" color="#999"></uni-icons>
        <uni-icons v-else type="down" size="20" color="#999"></uni-icons>
      </view>
      <view class="flex-cs">
        <view class="btm-left" v-if="addMedicines.length > 0">
          <view>已选<span>{{ addMedicines.length }}</span>种商品</view>
          <text>共{{ num }}件</text>
        </view>
        <view class="btm-left" v-else>
          <view>尚未选择商品</view>
          <text>共0件</text>
        </view>
        <button class="bottom-btn" @click.stop="confirm" :plain="true" style="border: none;"
          :disabled="isButtonDisabled">选定</button>
      </view>

    </view>
    <!-- 药品搜索说明 -->
    <uni-popup ref="popup">
      <view class="pops">
        <view class="tit">药品搜索操作说明</view>
        <view>选择药品支持药品名<text class="underline">首字母</text>搜索，药品名<text class="underline">模糊</text>搜索及药品规格<text
            class="underline">数字</text>搜索</view>
      </view>
    </uni-popup>
    <!-- 购物车 -->
    <uni-popup ref="popupbtm">
      <view class="pop2 fff">
        <view class="tit">所选药品清单</view>
        <view class="tips flex-cs">
          <view>已选药品</view>
          <view class="flex align-center">
            <uni-icons type="trash" size="20" color="#999"></uni-icons>
            <view class="underline" @click.stop="clearAllMedicines">清空所有药品</view>
          </view>
        </view>
        <view v-for="(i, index) in addMedicines" :key="i.MedID" class="cols pad-20 bors fff">
          <view class="bors">
            <view class="font-32">{{ i.MedName }}</view>
            <view class="flex-cs">
              <view>
                {{i.MinSellPack}}*{{i.SmallUnit}}, {{ i.Specification }}
              </view>
              <uni-number-box :step="1" v-model="i.Amount" :max="1000" @change="changeValueInCart(i, $event)" />
            </view>
            <view style="width: 100%;display: flex;margin:4rpx 0;">
              <view class="custom-height-28" style="width: 49%;">
                <uni-data-picker v-model="i.UseWay" :localdata="useWayOptions" popup-title="使用方法" :clear-icon="false"
                  @change="(value)=>selectUseWay(i,value)"></uni-data-picker>
              </view>
              <view class="custom-height-28" style="width: 49%;">
                <uni-data-picker v-model="i.UseInterval" :localdata="useIntervalOptions" popup-title="使用频率"
                  :clear-icon="false" @change="(value)=>selectUseInterval(i,value)"></uni-data-picker>
              </view>
            </view>
            <view style="width: 100%;display: flex;margin:10rpx 0;">
              <view class="custom-height-28" style="width: 49%;display: flex;justify-content: space-between;">
                <view style="width: 120rpx;height: 100%;text-align: left;padding-left: 10rpx;">
                  用量/{{i.UseQtyUnit}}
                </view>
                <uni-number-box :step="0.01" v-model="i.UseQty" :min="0.01" />
              </view>
              <view class="custom-height-28" style="width: 49%;display: flex;justify-content: space-between;">
                <view style="width: 120rpx;height: 100%;text-align: left;padding-left: 10rpx;">
                  天数
                </view>
                <uni-number-box :step="1" v-model="i.UseIntervalDays" :min="1" :max="90" />
              </view>
            </view>
          </view>
        </view>
      </view>
    </uni-popup>

  </view>
</template>
<script>
  //快速推方的选药页面
  import headerBar from '@/components/header-bar.vue';
  export default {
    components: {
      headerBar
    },
    data() {
      return {
        pagePadding: 0,
        medicines: [],
        selectedTags: [],
        num: 0,
        data: {
          CurrenetPageIndex: 1,
          PageSize: 10,
          pageTotal: 1,
          Keywords: '',
        },
        historyList: [],
        addMedicines: [],
        more: false,
        openCartStatus: true,
        useWayOptions: [],
        useIntervalOptions: [],
      }
    },
    computed: {
      isButtonDisabled() {
        return this.num == 0;
      }
    },
    onLoad() {
      this.useWayOptions = this.$dict.get('dic_use_way').map(i => ({
        value: i.code,
        text: i.name,
      }))
      this.useIntervalOptions = this.$dict.get('dic_use_interval').map(i => ({
        value: i.code,
        text: i.name,
      }))
    },
    onShow() {
      this.historyList = uni.getStorageSync('historyList') || [];
      if (this.$store.state.current.med_list) {
        this.addMedicines = this.$store.state.current.med_list
        this.num = this.addMedicines.reduce((sum, item) => sum + item.Amount, 0);

      }

    },
    onReachBottom() {
      this.data.CurrenetPageIndex++; // 页码加 1
      this.medicinesList();
      if (this.data.CurrenetPageIndex * 10 > this.data.pageTotal) {
        this.more = true
      }
    },
    methods: {
      selectUseWay(med, event) {
        const value = event.detail.value[0]
        med.UseWayCode = value.value
        med.UseWayName = value.text
      },
      selectUseInterval(med, event) {
        const value = event.detail.value[0]
        med.UseIntervalCode = value.value
        med.UseIntervalName = value.text
      },
      openCart(openCartStatus) {
        if (openCartStatus) {
          this.$refs.popupbtm.open('bottom');
          this.openCartStatus = false;
        } else {
          this.$refs.popupbtm.close();
          this.openCartStatus = true;
        }
      },
      setPagePadding(padding) {
        this.pagePadding = padding;
      },
      // 选择药品
      confirm() {
        this.$store.dispatch('current/setMedList', this.addMedicines)
        uni.navigateBack({
          delta: 1
        })
      },
      medicinesList() {
        return this.$api.medicine.SearchMedicine(this.data).then(res => {
          console.log(res);
          if (res.Success) {
            res.Items = res.Items.map(item => ({
              ...item,
              MedName: item.Name,
              PublicItem: item.Code,
              MedID: item.MedId,
              UseWay: item.UseWayCode, //使用方法代码
              UseInterval: item.UseIntervalCode, //使用频率代码
              UseIntervalDays: Number(item.UseIntervalDays), // 确保用药天数为数字
              UseQty: Number(item.UseQty) || 1, // 单次用量
              UseQtyUnit:item.UseUnit,
              Id: 0,
            }))
            if (this.data.CurrenetPageIndex == 1) {
              this.medicines = res.Items
            } else {
              this.medicines = this.medicines.concat(res.Items);
            }
            this.medicines.forEach(item => {
              item.Amount = 0;
              item.UseWay = item.UseWayCode; //使用方法代码
              item.UseInterval = item.UseIntervalCode; //使用频率代码
              item.UseIntervalDays = Number(item.UseIntervalDays); // 确保用药天数为数字
              item.UseQty = Number(item.UseQty); // 单词用量
            });
            this.data.pageTotal = res.TotalItems;
          } else {
            uni.showToast({
              title: res.ErrMsg,
              icon: 'none'
            })
          }

        }).catch(error => {
          console.error("Failed to fetch medicine list", error);
        });
      },
      search(i) {
        if (!i) {
          uni.showToast({
            title: '请输入搜索内容',
            icon: 'none'
          })
          return
        }
        wx.showLoading({
          title: '加载中...',
          mask: true
        });

        this.medicines = []
        this.data.Keywords = i;
        this.data.CurrenetPageIndex = 1;
        this.medicinesList().then(() => {
          // 保存搜索记录
          wx.hideLoading();
          let history = this.historyList;
          const index = history.indexOf(i);
          if (index == -1) { // 只有当历史记录中不存在该关键词时才添加
            history.unshift(i);
            if (history.length > 10) {
              history.pop();
            }
            uni.setStorageSync('historyList', history);
            this.historyList = history;
          }
        }).catch(error => {
          console.error("Error during search operation", error);
          wx.hideLoading();
        });
      },
      delItem(index) {
        if (index > -1) {
          this.historyList.splice(index, 1);
          uni.setStorageSync('historyList', this.historyList);
        }
      },
      delAll() {
        uni.showModal({
          title: '温馨提示',
          content: '确认清空历史记录吗？',
          showCancel: true,
          cancelText: '取消',
          confirmText: '确定',
          success: res => {
            if (res.confirm) {
              uni.setStorageSync('historyList', []); // 清空本地存储
              this.historyList = []; // 清空页面上的历史记录
            }
          }
        });
      },

      showPop() {
        this.$refs.popup.open();
      },
      // 购物车中的 changeValue 方法
      changeValueInCart(med, value) {
        let findM = this.addMedicines.find(item => item.MedID === med.MedID);
        if (findM) {
          if (value <= 0) {
            // 如果数量小于等于0，则从 addMedicines 数组中移除该项
            this.addMedicines = this.addMedicines.filter(item => item.MedID !== med.MedID);
          } else {
            // 更新其数量
            findM.Amount = value;
          }
          const medicineInList = this.medicines.find(item => item.MedID === med.MedID);
          if (medicineInList) {
            medicineInList.Amount = value;
          }
          this.num = this.addMedicines.reduce((sum, item) => sum + item.Amount, 0);
        }
      },
      changeValueInList(med, value) {
        let findM = this.addMedicines.find(item => item.MedID === med.MedID);
        if (value <= 0) {
          // 如果数量小于等于0，则从 addMedicines 数组中移除该项
          this.addMedicines = this.addMedicines.filter(item => item.MedID !== med.MedID);
        } else if (!findM) {
          // 如果找不到该药品，则添加到 addMedicines
          this.addMedicines.push({
            ...med,
            Amount: value
          });
        } else {
          // 如果找到了该药品，则更新其数量
          findM.Amount = value;
        }
        const medicineInList = this.medicines.find(item => item.MedID === med.MedID);
        if (medicineInList) {
          medicineInList.Amount = value;
        }
        this.num = this.addMedicines.reduce((sum, item) => sum + item.Amount, 0);
      },

      // 清空购物车方法
      clearAllMedicines() {
        this.addMedicines = [];
        this.num = 0;
        this.medicines.forEach(med => {
          med.Amount = 0;
        });
        this.$refs.popupbtm.close();
        this.openCartStatus = true;
        this.$store.dispatch('current/setMedList', this.addMedicines)

      },
      toggleSelection(tag) {
        const index = this.selectedTags.indexOf(tag);
        if (index > -1) {
          this.selectedTags.splice(index, 1);
        } else {
          this.selectedTags.push(tag);

        }
      },
      goPage(url) {
        uni.navigateTo({
          url: url
        })
      }

    }
  }
</script>
<style lang="scss">
  page {
    background: #eee;
  }

  .nomore {
    font-size: 24rpx;
    color: #666;
  }

  .pops {
    background: #fff;
    border-radius: 20rpx;
    width: 600rpx;
    padding: 50rpx 20rpx 0;

    .tit {
      text-align: center;
      font-size: 35rpx;
      font-weight: bold;
      padding-bottom: 20rpx;
    }
  }


  .pop2 {
    height: 1000rpx;
    border-radius: 20rpx 20rpx 0 0;
    overflow-y: auto;
    padding-bottom: 100rpx;

    .tit {
      font-size: 35rpx;
      text-align: center;
      padding-top: 40rpx;
      margin-bottom: 30rpx;
    }
  }

  .grey {
    color: grey;
  }

  .cols .bors:last-of-type {
    padding-bottom: 0;
    margin-bottom: 0;
    border-bottom: none;
  }

  .font-32 {
    font-size: 32rpx;
  }

  input {
    width: 100%;
  }

  .tags view {
    border: 1rpx solid #666;
    color: #666;
    border-radius: 50rpx;
    padding: 5rpx 20rpx;
  }

  .tips {
    background: #fdf4e3;
    padding: 20rpx;
    font-size: 26rpx;
    color: #777;
  }

  .underline {
    text-decoration: underline;
    color: rgb(248, 145, 80);
  }

  .tags view.selected {
    color: #fff;
    background: #1789f8;
    border-color: #1789f8;
  }

  .font-bold {
    font-weight: bold;
    margin-bottom: 15rpx;
  }

  .pages {
    padding-bottom: 150rpx;
  }

  .fff {
    background: #fff;
  }

  .nomore {
    font-size: 24rpx;
    color: #666;
  }

  .footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 30rpx 40rpx 40rpx;
    z-index: 999;
    box-shadow: 2px 2px 20px rgba(0, 0, 0, 0.2);
  }

  .changebtn {
    position: absolute;
    top: 10rpx;
    left: 50%;
    transform: translateX(-50%);
  }

  .btm-left {
    view {
      font-size: 32rpx;
      font-weight: bold;
    }

    span {
      color: rgb(248, 145, 80)
    }

    text {
      margin-top: 10rpx;
      color: #666;
      font-size: 26rpx;
    }
  }

  .bottom-btn {
    padding: 15rpx 35rpx;
    border: none;
    font-size: 30rpx;
    background: #00aa6c !important;
    color: #fff !important;
  }

  button[disabled] {
    background: #999999 !important;
  }

  .img {
    width: 50rpx;
    height: 50rpx;
    border-radius: 50%;
    margin-right: 10rpx;
  }

  .b1 {
    color: #fff;
    background: #1789f8;
    font-size: 26rpx;
    margin-left: 10rpx;
    padding: 10rpx 30rpx;
  }

  .efef {
    border-radius: 50rpx;
    background: #efefef;
    padding: 20rpx 30rpx;
  }

  .custom-height-28 {

    ::v-deep .input-value,
    ::v-deep .uni-easyinput__content-input {
      height: 28px;
    }
  }
</style>