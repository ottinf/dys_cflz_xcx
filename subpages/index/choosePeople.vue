<template>
  <view class="pages">
    <header-bar tit="选择患者" @updatePadding="setPagePadding"></header-bar>
    <view class="searchCon flex align-center fff pad-30" :style="{ paddingTop: pagePadding + 15 + 'px' }">
      <view class="flex-cs flex-1 efef">
        <view class="flex align-center flex-1">
          <uni-icons type="search" size="25"></uni-icons>
          <input type="text" v-model="data.Keywords" placeholder="请输入姓名">
        </view>
        <view @click="search" class="search-btn">搜索</view>
      </view>
    </view>
    <view class="margin-top-20 fff">
      <radio-group @change="radioChange">
        <label class="uni-list-cell uni-list-cell-pd" v-for="(item, index) in items" :key="item.Id">
          <view class="flex align-center">
            <uni-icons type="contact-filled" color="#999999" size="30"></uni-icons>
            <view>{{ item.Name }}</view>
          </view>
          <view>性别：{{ item.Gender == '1' ? '男' : '女' }}&nbsp;&nbsp;&nbsp;年龄：{{ item.Age }}</view>
          <view>
            <radio :value="index" color="#1789f8" :checked="index === current" />
          </view>
        </label>
      </radio-group>
    </view>
    <view class="text-center pad-20 nomore" v-if="more">没有更多了</view>
    <button class="bottom-btn" @click="goBack" :plain="true" style="border: none;" :disabled="disabled">确定</button>
  </view>
</template>
<script>
import IDCardUtil from '@/common/IDCardUtil'
import headerBar from '../../components/header-bar.vue'
export default {
  components: {
    headerBar
  },
  data() {
    return {
      pagePadding: 0,
      more: false,
      disabled: true,
      items: [],
      current: null,
      checkingTask: null,
      data: {
        CurrenetPageIndex: 1,
        PageSize: 15,
        pageTotal: 0,
        Keywords: '',
        Status: 20000, //代表只查患者补充过信息的订单
        StatusQueryType: 100
      },
      radioValue: {
        value: '',
        name: '',
        sex: '',
        age: '',
        checked: '',
      }
    }
  },
  computed: {

  },

  onLoad() {
    this.getList()
    this.data.CurrenetPageIndex = 1
  },

  onReachBottom() {
    this.data.CurrenetPageIndex++; // 页码加 1
    this.getList();
    if (this.data.CurrenetPageIndex * 15 > this.data.pageTotal) {
      this.more = true
    }
  },
  methods: {
    setPagePadding(padding) {
      this.pagePadding = padding
    },
    getList() {
      this.$api.order.FindOrderWithPager(this.data).then(res => {
        if (res.Success) {
          res.Items = res.Items.map(i => ({
            ...i, // 使用括号包裹对象字面量
            Id: 0, //重置id
            PatSysType: 1, //图文问诊
            Med_type: 0, //非医保订单
            _opr_id: i.Id, //使用另外的变量保存id
            Age: IDCardUtil.getAge(i.IDCard),
            Birthday: IDCardUtil.getBirthDate(i.IDCard)
          }));

          if (this.data.CurrenetPageIndex == 1) {
            this.items = res.Items
            this.checkForDuplicates(this.items, 1)
          } else {
            let start = this.items.length
            this.items = this.items.concat(res.Items);
            this.checkForDuplicates(start, this.items)
          }
          this.data.pageTotal = res.TotalItems;
        } else {
          uni.showToast({
            title: res.ErrMsg,
            icon: 'none'
          })
        }
      })
    },
    search() {
      this.data.CurrenetPageIndex = 1
      this.getList()
    },
    radioChange(e) {
      console.log(e.target.value, 'e');
      console.log(this.items, 'items')
      this.radioValue = this.items.find((v, index) => index == e.target.value)
      console.log(this.radioValue);
      this.$store.dispatch('current/setPatInfo', this.radioValue)
      this.disabled = false

    },
    /**
     * 检查药品列表，删除重复项
     * @param {Array} list - 药品列表
     * @param {number} index - 当前处理的下标
     */
    checkForDuplicates(list, index) {
      if (this.checkingTask) {
        console.warn("检查正在进行中，请稍后再试。");
        return; // 如果正在检查，则不执行
      }

      this.checkingTask = setInterval(() => {
        let currentItem;
        try {
          if (index <= 0)
            throw new Error('下标错误')
          currentItem = list[index];
          // 检查索引前面的项是否有重复
          const hasDuplicate = list.slice(0, index).some(item => item.Name === currentItem.Name && item.IDCard === currentItem.IDCard);

          if (hasDuplicate) {
            // 如果有重复，删除当前项
            list.splice(index, 1);
            console.log(`重复项删除: ${currentItem.Name}`);
            // 由于删除了项，当前下标保持不变
          } else {
            // 如果没有重复，继续检查下一个
            index++;
          }

          // 如果已经检查到列表的开头，停止检查
          if (index >= list.length) {
            clearInterval(this.checkingTask);
            this.checkingTask = null;
          }
        }
        catch (e) {
          clearInterval(this.checkingTask);
          this.checkingTask = null;
          return;
        }

      }, 10); // 每100毫秒检查一次
    },
    goPage(url) {
      uni.navigateTo({
        url: url
      })
    },
    goBack() {
      uni.redirectTo({
        url: '/subpages/index/quicklyPush'
      })
    }

  }
}
</script>
<style lang="scss">
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
  z-index: 999;
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
  padding: 10rpx 20rpx;
}
</style>