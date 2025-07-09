<template>
  <view style="width: 100%;display: flex;flex-direction: column;">
    <!-- <view class="switch">
      <text v-if="changeswitch1">待问诊</text>
      <text v-else>全部列表</text>
      <switch checked style="transform:scale(0.7)" @change="switch1Change" />
    </view> -->
    <view style="padding: 6rpx 30rpx;width:calc( 100% - 60rpx );display: flex;justify-content: space-between;">
      <input suffixIcon="search" v-model="query.Keywords" placeholder="输入名称"
        style="background-color: #fff;height: 30px;padding: 0 10rpx;width: calc( 100% - 160rpx );" />
      <button @click="_search()"
        style="width: 120rpx;height: 30px;background-color: #70a7ff;color: #fff;line-height: 30px;">搜索</button>
    </view>
    <view v-if="0" @click="startAutoRefresh">
      {{ Refresh ? '已开启自动刷新' : '开启自动刷新' }}
    </view>
    <view style="display: flex; align-items: center;flex-direction: column;height: fit-content;">
      <view v-for="(item, index) in list" :key="index" class="opr-item-box">
        <slot name="itemslot" :item="item">
          <view style="width: 100%; display: flex; flex-direction: column;" @click="_jump(item)">
            <view style="width: 100%; display: flex; justify-content: space-between;">
              <view v-if="item.Name">
                <span style="font-size: 32rpx; font-weight: bold;">{{ item.Name }}</span>
                <span v-if="item.Gender && item.Age" style="font-size: 26rpx; font-weight: 200;margin-left: 20rpx;">{{
                  item.Gender == 1 ||
                    item.Gender == '男' ? '男' : '女' }}&nbsp;&nbsp;{{ item.Age }}岁</span>
              </view>
              <view v-else style="font-size: 32rpx; font-weight: bold;">
                暂未关联患者
              </view>
              <view style="font-size: 32rpx; font-weight: bold;color: #677199;">
                {{ item.StatusName }}
              </view>
            </view>

            <view style="width: 100%; display: flex; justify-content: space-between; margin-top: 10rpx;">
              <view style="font-size: 26rpx; font-weight: 200;">
                {{ item.CreateDate }}
              </view>

              <view v-if="queryData.DocListOption === 0" style="font-size: 26rpx; font-weight: 200;">
                {{ item.MedTypeName }}
              </view>
              <view v-if="queryData.DocListOption === 1" style="font-size: 26rpx; font-weight: 200;">
                {{ item.DrugName }}
              </view>
            </view>

            <view v-if="queryData.DocListOption === 0"
              style="width: 100%; display: flex; flex-wrap: wrap; gap: 10rpx; margin-top: 10rpx;">
              <view class="diag-tag" v-for="(diag, diag_index) in item.Diagnoses" :key="diag_index">
                {{ diag.MC }}
              </view>
            </view>

            <view v-if="item.Status == 90000"
              style="width: 100%; display: flex; flex-direction:row-reverse; gap: 10rpx; margin-top: 20rpx;padding-bottom: 6rpx;">
              <uni-tag type="primary" :inverted="!item.IsDrugConsigned" size="small"
                :text="item.IsDrugConsigned ? '已发药' : '未发药'">
              </uni-tag>
              <uni-tag v-if="0" type="primary" :inverted="!item.IsDrugReviewed" size="small"
                :text="item.IsDrugReviewed ? '已复核' : '未复核'">
              </uni-tag>
              <uni-tag type="primary" :inverted="!item.IsDrugDeployed" size="small"
                :text="item.IsDrugDeployed ? '已调配' : '未调配'">
              </uni-tag>
              <uni-tag type="primary" :inverted="!item.IsDrugAudited" size="small"
                :text="item.IsDrugAudited ? '已审核' : '未审核'">
              </uni-tag>
            </view>
          </view>
        </slot>
      </view>
      <view v-if="!more" style="text-align: center; padding: 20rpx;">
        已加载全部
      </view>
      <view v-else-if="loading" style="text-align: center; padding: 20rpx;">
        正在加载...
      </view>
      <view v-else style="text-align: center; padding: 20rpx;" @click="_loaddata()">
        点击加载更多[{{ list.length }}/{{ query.pageTotal }}]
      </view>
      <view style="margin-top: 120rpx;height: 1rpx;width: 100%;">

      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    queryData: {
      type: Object,
      default: () => ({})
    },
    callbacks: {
      type: Object,
      default: () => ({})
    },
  },
  data() {
    return {
      list: [],
      query: {
        CurrenetPageIndex: 1,
        PageSize: 10,
        pageTotal: 0,
        Keywords: '',
        Status: 0,
      },
      more: true,
      loading: false,
      Refresh: false
    };
  },
  watch: {
    'queryData': {
      handler(newVal, oldVal) {
        if (newVal !== oldVal && newVal) {
          this.query = {
            ...this.query,
            ...newVal,
          }
        }
      },
      deep: true,
      immediate: true
    },
    'callbacks.queryFunc': {
      handler(newVal, oldVal) {
        if (newVal !== oldVal && newVal) {
          //this._search(); // 重新加载数据
        }
      },
      deep: true,
      immediate: true,

    }
  },
  methods: {
    async _loaddata() {
      if (this.loading) return;
      this.loading = true;
      this.query.CurrenetPageIndex++
      try {
        const res = await this.$CommonFunction.invokeAsync(this.callbacks.queryFunc, this.query);
        this.loading = false;

        if (res.Success) {
          let items = res.Items;
          if (this.callbacks.afterLoadFunc) {
            items = this.$CommonFunction.invoke(this.callbacks.afterLoadFunc, items);
          }
          if (this.query.CurrenetPageIndex === 1) {
            this.list = items;
          } else {
            this.list = this.list.concat(items);
          }

          this.query.pageTotal = res.TotalItems;
          this.more = this.list.length < res.TotalItems

        } else {
          throw new Error(res.ErrMsg)
        }
      } catch (error) {
        this.loading = false;
        uni.showToast({
          title: error.message,
          icon: 'none'
        });
      }
    },
    // 搜索
    _search() {
      this.query.CurrenetPageIndex = 0;
      this.more = false;
      this._loaddata();
      console.log(this.list)
    },
    startAutoRefresh() {
      this.Refresh = !this.Refresh
      // this._search(); // 立即加载一次
      // if (this.Refresh) {
      //   this.timer = setInterval(() => {
      //     this._search();
      //   }, 5000); // 10秒 = 10000毫秒
      // }

    },
    // 跳转页面
    _jump(item) {
      const url = this.$CommonFunction.invoke(this.callbacks.getPathFunc, item);
      if (url) {
        uni.navigateTo({
          url
        });
      }
    },
  },
  computed: {

  },
  onShow() {
    //this._loaddata();
  },
  mounted() { }
};
</script>

<style lang="scss">
.diag-tag {
  border-radius: 10rpx;
  padding: 10rpx 16rpx;
  background: #16B882;
  display: inline-block;
  font-family: PingFang SC;
  font-weight: bold;
  font-size: 24rpx;
  color: #ffffff;
  margin-right: 20rpx;
}

.opr-item-box {
  width: calc(100% - 80rpx);
  height: fit-content;
  padding: 20rpx;
  margin: 10rpx;
  background: #ffffff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 15rpx;
}

.switch {
  padding: 10rpx 30rpx;
}
</style>