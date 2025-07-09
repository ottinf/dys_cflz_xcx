<template>
  <view class="pages">
    <header-bar tit="订单列表" :showLeft="false"></header-bar>
    <view :style="{ paddingTop: '180rpx' }" />
    <view v-if="0" style="width: 100%;">
      <uni-segmented-control :current="cur_segment" :values="segments" @clickItem="_switch" />
    </view>
    <view style="width: 100%;display: flex;justify-content: space-evenly;">
      <uni-data-select v-model="DateSelectValue" :localdata="DateOptions" @change="" placeholder="选择日期"
        style="width: 45%;background-color: #ffffff;color: #000000;"></uni-data-select>
      <uni-data-select v-if="IsDrugPhar" v-model="queryData.SignFlag" :localdata="SignFlagOptions" @change=""
        placeholder="选择类别" style="width: 45%;background-color: #ffffff;color: #000000;"></uni-data-select>
      <uni-data-select v-if="IsDoctor" v-model="queryData.DocListOption" :localdata="DocOptions" @change="_changeDoctorQueryFunc"
        placeholder="选择类别" style="width: 45%;background-color: #ffffff;color: #000000;"></uni-data-select>
    </view>
    <view style="width: 100%;height: fit-content;overflow-y: scroll;" v-if="searchListOptions.length">
      <view style="width: 100%;height: fit-content;padding-top: 10rpx;">
        <searchListVue ref="searchListRef" :callbacks="searchListOptions[0]" :queryData="queryData">
        </searchListVue>
      </view>
    </view>
  </view>
</template>
<script>
  import headerBar from '../../components/header-bar.vue'
  import searchListVue from '../../components/search-list.vue';
  import dictionary from '../../utils/dictionary';
  import order from '../../api/modules/order';
  import sign from '../../api/modules/sign';
  import dayjs from 'dayjs';
  export default {
    components: {
      headerBar,
      searchListVue
    },
    data() {
      return {
        segments: [],
        cur_segment: 0,
        userInfo: {},
        searchListOptions: [],
        DateOptions: [],
        DateSelectValue: '',
        SignFlagOptions: [],
        DocOptions: [],
        queryData: {
          StartDate: '',
          EndDate: '',
          SignFlag: '',
          DocListOption:1,
        },
      }
    },
    async created() {
      await this.initdata()
    },
    onShow() {
      console.log(this.userInfo.Role)
    },
    computed: {
      IsDoctor() {
        return this.$privilege.asUserType('Doctor')
      },
      IsDrugPhar() {
        return this.$privilege.hasRole('drug_audit_phar') || this.$privilege.hasRole('drug_deploy_phar') ||
          this.$privilege.hasRole('drug_review_phar') || this.$privilege.hasRole('drug_consign_phar')
      }
    },
    watch: {
      'DateSelectValue': {
        handler(newVal, oldVal) {
          if (newVal) {
            // 将选中的日期转换为当天的开始时间（00:00:00）和结束时间（23:59:59）
            this.queryData.StartDate = dayjs(newVal).startOf('day').valueOf();
            this.queryData.EndDate = dayjs(newVal).endOf('day').valueOf();
          } else {
            // 如果 DateSelectValue 为空，清空 StartDate 和 EndDate
            this.queryData.StartDate = 0;
            this.queryData.EndDate = 0;
          }
        },
        immediate: true
      },
    },
    methods: {
      async initdata() {
        this.userInfo = uni.getStorageSync('userInfo');
        let self = this

        this.DateOptions = Array.from({
          length: 30
        }, (_, index) => {
          const date = dayjs().subtract(index, 'day'); // 从今天往前推 index 天
          const text = date.format('YYYY-MM-DD'); // 格式化日期
          const value = text; // 值和文本相同
          return {
            text,
            value
          };
        });
        this.DateOptions.unshift({
          text: '不限时间',
          value: '',
        })

        this.DateSelectValue = this.DateOptions[0].value; // 默认选中今天

        this.SignFlagOptions = [{
            text: '不限',
            value: ''
          },
          {
            text: '待审核',
            value: 'UnAudit'
          },
          {
            text: '待调配',
            value: 'UnDeploy'
          },
          {
            text: '待发药',
            value: 'UnConsign'
          }
        ];

        this.DocOptions = [{
            text: '全部',
            value: 0
          },
          {
            text: '待问诊',
            value: 1
          },
        ];

        this.queryData.SignFlag = this.SignFlagOptions[0].value; // 默认选中“全部”
        this.queryData.DocListOption = this.DocOptions[1].value;//默认查待问诊
        let index = 0
        if (1) {
          this.segments.push('默认')
          this.searchListOptions[index] = {
            queryData: {
              searchListType: '',
            },
            queryFunc: `queryFunc_${index}`,
            afterLoadFunc: `afterLoadFunc_${index}`,
            getPathFunc: `getPathFunc_${index}`
          }
          if(this.IsDoctor)
          {
            this._changeDoctorQueryFunc(1,false)
          }
          else{
            this.$CommonFunction.register(this.searchListOptions[index].queryFunc, order.FindOrderWithPager)
          }
          
          this.$CommonFunction.register(this.searchListOptions[index].afterLoadFunc, item => item.map(i => ({
            ...i,
            StatusName: self.getStatusName(i.Status),
            MedTypeName: self.getMedTypeName(i.Med_type),
          })))
          this.$CommonFunction.register(this.searchListOptions[index].getPathFunc, (item) =>
            `/subpages/index/orderDetail?Id=${item.Id}`)
        }

        //等待子组件加载完毕后查询数据
        await this.$utilDo.delay(100)
        this.$refs.searchListRef._search()

      },
      _switch({
        currentIndex
      }) {
        this.cur_segment = currentIndex
      },
      _changeDoctorQueryFunc(value,is_search=true){
        if(value===0)
        {
          //查全部
          this.$CommonFunction.register(this.searchListOptions[0].queryFunc, order.FindOrderWithPager)
        }
        else if(value===1){
          //查待问诊列表
          this.$CommonFunction.register(this.searchListOptions[0].queryFunc, order.FindWaitingPatientPager)
        }
        //修改选项时，自动查询列表
        if(is_search)
          this.$refs.searchListRef._search()
      },
      getStatusName(status) {
        const item = dictionary.dic_patient_status_type.find(item => item.value === status);
        return item ? item.name : '未知';
      },
      getMedTypeName(value) {
        const item = dictionary.dic_pat_med_type.find(item => item.id === value);
        return item ? item.name : '未知';
      },
      
    }
  }
</script>
<style lang="scss">
  .pages {
    background: #efefef;
  }

  .nomore {
    font-size: 24rpx;
    color: #666;
  }

  .tags {
    border-radius: 10rpx;
    padding: 10rpx 20rpx;
    background: #F4FFFB;
    border: 1px solid #00AA6C;
    display: inline-block;
    font-family: PingFang SC;
    font-weight: 400;
    font-size: 24rpx;
    color: #00AA6C;
    margin-right: 20rpx;
  }

  .cols {
    display: flex;
    flex-direction: column;
  }

  .card {
    border-radius: 10rpx;
    padding: 30rpx;
  }


  .efef {
    border-radius: 50rpx;
    background: #efefef;
    padding: 20rpx;
  }
</style>