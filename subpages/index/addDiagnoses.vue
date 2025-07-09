<template>
  <view>
    <header-bar @updatePadding="setPagePadding" tit="选择确诊疾病"></header-bar>
    <view class="pages pad-30" :style="{ paddingTop: pagePadding + 15 + 'px' }">
      <view class="flex align-center">
        <view class="flex align-center flex-1 efef">
          <input type="text" v-model="data.Keywords" placeholder="请输入关键字进行搜索诊断">
          <view class="search"
            style="display: flex;justify-content: center;align-items: center;width: 180rpx;height: 66rpx;"
            @click="_resetSearch">
            搜索
            <!-- <uni-icons type="search" size="20"></uni-icons> -->
          </view>
        </view>
      </view>
      <view class="message"><uni-icons type="sound-filled" size="12" color="#777"
          style="margin-right: 4rpx;"></uni-icons> 温馨提示:<span style="margin-left: 10rpx;">如果药品没有相关诊断,请在搜索框进行搜索</span>
      </view>
      <view class="margin-top-30">
        <view class="bors" v-if="selectedTags.length > 0">
          <view>已选疾病：</view>
          <view class="tags flex margin-top-20 flex-wrap gap-20">
            <view v-for="(tag, idx) in selectedTags" :key="idx" :class="{ 'selected': selectedTags.includes(tag) }"
              class="flex gap-10 ">
              {{ tag.MC }}
              <uni-icons @click="deleteDiag(idx)" type="closeempty" size="16" color="#fff" ></uni-icons>
            </view>
          </view>
        </view>
        <view class="margin-top-50" v-if="!data.Keywords">药品主治疾病：</view>
        <view class="cols margin-top-30" v-if="!data.Keywords">
          <view v-for="(medicine, index) in medicines" :key="index">
            <view class="font-bold">{{ medicine.Name }}</view>
            <view class="tags flex gap-20 flex-wrap">
              <view v-for="(tag, idx) in medicine.diag" :key="idx" @click="addDiag(tag)"
                style="border: 1rpx solid #666;" :class="{ 'selected': selectedTags.includes(tag) }">{{ tag.DiagName }}
              </view>
            </view>
          </view>
        </view>
        <view class="cols margin-top-30" v-if="data.Keywords">
          <view v-for="(diag, index) in diagnoses" :key="index" @click="addDiag(diag)"
            style="box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);  background:linear-gradient(90deg , #58F0B9, #2CD398); padding: 13rpx 20rpx; border-radius: 10rpx;">
            <view style="color: #2C2E2E;">
              {{ diag.BM }}
            </view>
            <view style="color: #2C2E2E;">
              {{ diag.MC }}
            </view>
          </view>
          <view style="width: 100%;padding: 6rpx 20rpx;display: flex;justify-content: center;align-items: center;">
            <text v-if="loadmore === 0" @click="search()">
              点击加载更多
            </text>
            <text v-else-if="loadmore === 1">
              正在加载中...
            </text>
            <text v-else-if="loadmore === 2">
              没有更多了
            </text>
            <text v-else-if="loadmore === -1">
              加载出现错误
            </text>
          </view>

        </view>

      </view>
      <button class="bottom-btn" @click="confirm" :plain="true" style="border: none;"
        :disabled="isButtonDisabled">确定</button>
    </view>
  </view>

</template>
<script>
import headerBar from '@/components/header-bar.vue';
export default {
  components: {
    headerBar,
  },
  data() {
    return {
      medicines: [],
      selectedTags: [],
      data: {
        CurrenetPageIndex: 1,
        PageSize: 10,
        pageTotal: 1,
        Keywords: '',
      },
      loadmore: 0,
      tags: [],
      mbdiags: [],
      diagnoses: [],
      PublicItem: 'tnb',
      pagePadding: 0,
    }
  },
  computed: {
    isButtonDisabled() {
      return this.selectedTags.length == 0;
    }
  },
  watch: {
    selectedTags: {
      handler(newVal) {
        // 根据BM属性去重
        if (newVal.length > 0) {
          const uniqueTags = [];
          const bmSet = new Set();

          newVal.forEach(tag => {
            if (!bmSet.has(tag.BM)) {
              bmSet.add(tag.BM);
              uniqueTags.push(tag);
            }
          });

          // 只有当数组长度不同时才更新，避免无限循环
          if (uniqueTags.length !== newVal.length) {
            this.selectedTags = uniqueTags;
          }
        }
      },
      deep: true
    }
  },
  onLoad() {
    this.medicines = this.$store.state.current.med_list
    this.getFindMedDiag()
    this.getMbDiags()
    this._resetSearch()
  },
  methods: {
    setPagePadding(padding) {
      this.pagePadding = padding;
    },
    // 获取药品下的诊断
    async getFindMedDiag() {
      for (let i = 0; i < this.medicines.length; i++) {
        this.medicines[i].diag = []
        try {
          let res = await this.$api.medicine.FindMedDiag({
            PublicItem: this.medicines[i].PublicItem
          })
          this.medicines[i].diag = res.ResData
        } catch (error) {
          console.log(error);
        }
      }
      this.$forceUpdate()
    },
    // 获取慢病诊断
    async getMbDiags() {
      try {
        let res = await this.$api.diagnoses.searchDiag({
          LB: '慢病',
          PageSize: 1000
        })
        this.mbdiags = res.ResData.Items
      } catch (error) {
        console.log(error);
      }

    },
    confirm() {
      this.$store.dispatch('current/setDiagList', this.selectedTags)
      uni.navigateBack({
        delta: 1
      })
    },
    addDiag(data) {
      if (data.DiagCode) {
        //从药品对应诊断来的
        this.selectedTags.push({
          BM: data.DiagCode,
          MC: data.DiagName,
          LB: data.DiagType || this.isMb(data.DiagCode) ? 'M' : 'D'
        });
      } else {
        //从搜索来的
        this.selectedTags.push(data)
        //关闭搜索
        this.CurrenetPageIndex = 0
        this.diagnoses = []
        this.data.Keywords = ''
      }
    },
    deleteDiag(index) {
      this.selectedTags.splice(index, 1);
    },
    _resetSearch() {
      this.data.CurrenetPageIndex = 0; // 页码加 1
      this.diagnoses = [];
      this.loadmore = 0;
      this.search()
    },
    search() {
      this.data.CurrenetPageIndex++;
      this.loadmore = 1;
      this.$api.diagnoses.searchDiag(this.data).then(res => {
        if (res.Success) {
          console.log(res);
          if (res.ResData.Items.length) {
            this.loadmore = 0;
            this.diagnoses = [
              ...this.diagnoses,
              ...res.ResData.Items,
            ]
          } else {
            this.loadmore = 2;
          }

        } else {
          this.loadmore = -1;
          uni.showToast({
            title: res.ErrMsg,
            icon: 'none'
          })
        }

      })
    },
    goPage(url) {
      uni.navigateTo({
        url: url
      })
    },
    isMb(code) {
      let item = this.mbdiags.find(i => i.BM == code)
      return item != null
    }

  }
}
</script>
<style lang="scss">
page {
  background: #fff;
}

.tags view {
  // border: 1rpx solid #666;
  color: #666;
  border-radius: 50rpx;
  padding: 5rpx 20rpx;
}

.tags view.selected {
  color: #fff;
  background: #05B979;
}

.font-bold {
  font-weight: bold;
  margin-bottom: 15rpx;
}

.cols {
  display: flex;
  flex-direction: column;
  gap: 30rpx;
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

.bottom-btn {
  position: fixed;
  bottom: 30rpx;
  left: 10rpx;
  right: 10rpx;
  padding: 25rpx 0;
  border: none;
  font-size: 30rpx;
  background: #00AA6C !important;
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
  padding: 0rpx 30rpx;
  height: 80rpx;
}

.search {
  border-radius: 30rpx;
  background: #00AA6C;
  color: #fff;
}

.message {
  margin: 20rpx 0 0 0;
  background: #fdf4e3;
  padding: 20rpx;
  font-size: 26rpx;
  color: #777;
  display: flex;
  align-items: center;
}
</style>