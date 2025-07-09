<template>
  <div style="width: 100vw; height: 100vh; background-color: #000; position: relative;">
    <!-- 远程视频显示 -->
    <view class="remote_box">
      <template>
        <movable-area style="width: 100%; height: 100%; background-color: #222;">
          <!-- 本地视频显示 -->
          <movable-view class="local_box" :x="local_box_position.x" :y="local_box_position.y" direction="all">
            <live-pusher id="livePusher" ref="livePusher" :url="local_stream" mode="RTC" autoplay enable-ans autopush
              codec="h264" style="width: 100%; height: 100%; background-color: #555;" />
            <view v-if="!local_stream" style="width: 100%; height: 100%; position: absolute; top: 0; left: 0;">
            </view>
          </movable-view>
          <!--  -->
          <movable-view class="local_box" :x="270" :y="local_box_position.y" direction="all">
            <live-player :src="remote_stream" mode="RTC" :autoplay="true" object-fit="contain"
              style="width: 100%; height: 100%; position: absolute; " />
            <view v-if="!remote_stream"
              style="width: 100%; height: 100%; position: absolute; top: 0; right: 0; background-color: #333; display: flex; justify-content: center; align-items: center;">
            </view>
          </movable-view>
        </movable-area>
      </template>
    </view>
    <!-- 视频问诊药品药品展示 -->
    <view class="card-box">
      <view class="infoCard">
        <view class="header"
          style="display: flex; justify-content: space-between; align-items: center; padding: 5rpx 0;">
          <view style="font-size: 35rpx; font-weight: bold;">患者信息</view>
          <view style="display: flex; align-items: center;">
            <view style="font-weight: bold; font-size: 35rpx; margin-right: 10rpx;">处方类型:</view>
            <view class="flex flex-warp gap-30 tags">
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
        </view>
        <view class="infor">
          <view class="cardinf">
            <view class="left">
              <view class="item">
                <view class="label">姓名:<text>{{ data.Name }}</text></view>
              </view>
              <view class="item">
                <view class="label">性别: <text>{{ data.Gender == '1' ? '男' : '女' }}</text></view>
              </view>
              <view class="item">
                <view class="label">年龄: <text>{{ data.Age }}</text></view>
              </view>
            </view>
            <view class="right">
              <view class="item">
                主诉: <input type="text" v-model="data.ChiefComplaint">
              </view>
              <view class="item">
                过敏史: <input type="text" v-model="data.AllergyHistory">
              </view>
              <view class="item">
                现病史: <input type="text" v-model="data.CurrentHistory">
              </view>
              <view class="item">
                既往史: <input type="text" v-model="data.OldHistory">
              </view>
            </view>
          </view>
          <view style="font-size: 30rpx; font-weight: bold;">
            <view>
              <view style="display: flex; align-items: center;">适应症:<input
                  style="width: 40%; border: 1px solid #000; margin-left: 10rpx;" v-model="search"
                  placeholder="请输入搜索关键字" @input="searchChange" /></view>
              <text class="tag" selectable style="margin: 20rpx 10rpx 0 0 ;" v-for="item, index in data.Diagnoses"
                :key="index">{{
                  item.MC
                }} <text class="iconx" @click="Deldiagnose(index)">x</text> </text>
            </view>
          </view>
        </view>
      </view>
      <!-- 适应症 -->
      <div class="diagnose">
        <div class="diagnose_box" v-if="search && Diagnoses.length">
          <div class="item" v-for="(item, index) in Diagnoses" :key="index" @click="AddDiagnose(item)">
            <span>{{ item.MC.length > 12 ? item.MC.slice(0, 12) + '...' : item.MC }}</span>
          </div>
          <div class="page">
            <span @click="goup">上一页</span> <input style="width: 134rpx; text-align: center;" type="number"
              placeholder="输入页码" v-model="CurrenetPageIndex" @input="gopage"> <span @click="godown">下一页</span>
          </div>
        </div>
      </div>
      <scroll-view scroll-y>
        <view class="card-cont">
          <view class="card fff">
            <view class="font-35 font-bold pad-btm-40">药品信息</view>
            <view class="cols">
              <view class="flex-cs bors" v-for="(i, index) in mList" :key="index">
                <view style=" width: 100%;">
                  <view style="display: flex; justify-content: space-between;">
                    <view class="font-35 ">{{ i.MedName }} </view>
                    <view v-if="$privilege.asUserType('Doctor')" style="display: flex; ">
                      <view class="del" @click="del(i.Id, index)">删除</view>
                      <view class="edit" @click="edit(i.Id, index)">编辑</view>
                    </view>
                  </view>
                  <view>
                    <view class="margin-top-10 flex align-center"
                      style="justify-content: space-between;flex-wrap: wrap;">
                      <view style="display: flex; align-items: center;width: 100%;">
                        <uni-icons type="calendar" size="25" color="#03a9f4"></uni-icons>
                        <view class="methods">{{ i.UseWayDesc }}，{{ i.UseIntervalDesc }}，一次{{ i.UseQty }}{{ i.UseQtyUnit
                        }}，{{ i.UseIntervalDays }}/天
                        </view>
                      </view>
                      <view class="flex"
                        style="width: 100%; text-align: center; display: flex;justify-content: flex-end; ">
                        <view class="font-bold" style="color: #ef7a14;">{{ i.Amount }}{{ i.BigUnit
                        }}*{{ i.CnvValue }}{{ i.SmallUnit }} <span style="padding-left: 26rpx;">用药天数{{
                            i.UseIntervalDays }}天</span></view>
                      </view>
                    </view>

                  </view>
                </view>

              </view>
            </view>
          </view>
        </view>
      </scroll-view>
      <view @click="save" class="savebtn">保存</view>
    </view>
    <!-- 修改药品弹窗 -->
    <view class="editCard" v-for="item in NewmList" v-if="editfrom">
      <view class="editItem">
        <view class="title">修改药品 </view>
        <view class="cont">
          <view class="item">服用方法
            <uni-data-select style="width: 400rpx;  margin-left:30rpx ;" v-model="wayValue" :localdata="dictUseWay"
              @change="change" :clear="false"></uni-data-select>
          </view>
          <view class="item">服用频率
            <uni-data-select style="width: 400rpx;  margin-left:30rpx ;" v-model="valValue" :localdata="dictUseInterval"
              @change="valchange" :clear="false"></uni-data-select>
          </view>
          <view class="item">
            服用单位<input type="text" v-model="item.UseQty">/{{ item.UseQtyUnit }}
          </view>
          <view class="item">
            数量<input type="text" v-model="item.Amount">/{{ item.BigUnit }}
          </view>
          <view class="item">
            天数<input type="text" v-model="item.UseIntervalDays">/天
          </view>
        </view>
        <view class="btn">
          <view class="cancel" @click="editfrom = false">取消修改</view>
          <view class="sure" @click="sure">确定修改</view>
        </view>
      </view>
    </view>
    <view class="bottomBar">
      <view @click="InquiryFinish" class="endvideo">结束问诊并通过</view>
      <view class="bottom-btn" @click="DoctorNoPass()">不通过</view>
    </view>
  </div>
</template>

<script>
import AgoraMiniappSDK from "../libs/sdk.js";
let client = new AgoraMiniappSDK.Client(); // 声网客户端
import dictionary from '@/utils/dictionary';
export default {
  data() {
    return {
      appid: '6eed980d580241e3ab489f160c4242e4',
      channel: '',
      token: '',
      local_stream: null, // 本地视频流
      remote_stream: null, // 远程视频流
      local_box_position: { x: 0, y: 0 }, // 本地视频框位置
      uid: 10001,
      data: {},
      mList: [],
      UseWay: dictionary.dic_use_way,
      UseInterval: dictionary.dic_use_interval,
      StatusMap: dictionary.dic_patient_status_type,
      //修改药品弹窗数据F
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
      recordProcedure: 0,
      videoPath: '',
      videoAd: false,
      search: "",
      Diagnoses: [],
      CurrenetPageIndex: 1

    };
  },
  async onLoad(option) {
    console.log(this.data, 'data')
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
    this.data.Id = option.Id
    if (!option.Id) {
      return
    }
    let pres = await this.$api.order.OrderDetail({
      Id: this.data.Id
    })
    if (pres.Success) {
      this.data = pres.ResData;
    } else {
      return uni.showToast({
        title: pres.ErrMsg,
        icon: 'none'
      })
    }
    this.channel = 'cflz_' + option.Id
    await this.initShipin(); // 初始化视频功能
    this.getMlist();
    this.recording();

  },
  async onBackPress() {
    console.log('onBackPress')
    await this.leaveChannel(); // 离开频道
  },
  async beforeDestroy() {
    console.log('beforeDestroy')
    await this.leaveChannel(); // 离开频道
  },
  methods: {
    //删除诊断
    Deldiagnose(index) {
      console.log(index)
      if (this.data.Diagnoses.length == 1) return uni.showToast({ title: '至少保留一个诊断', icon: 'none' })
      this.data.Diagnoses.splice(index, 1)

    },
    //选择添加诊断
    AddDiagnose(item) {
      if (this.data.Diagnoses.length == 5) return uni.showToast({ title: '最多添加5个诊断', icon: 'none' })
      if (this.data.Diagnoses.some(v => v.Id == item.Id)) return uni.showToast({ title: '诊断已存在', icon: 'none' })
      this.data.Diagnoses.push(item)
      this.search = ''
    },
    //搜索诊断
    async searchChange() {
      try {
        let res = await this.$api.diagnoses.searchDiag({
          CurrenetPageIndex: this.CurrenetPageIndex,
          PageSize: 9,
          Keywords: this.search,
          LB: " ",
        })
        this.Diagnoses = res.ResData.Items
      } catch (e) {
        console.log(e)
      }
    },
    //诊断列表翻页
    goup() {
      if (this.CurrenetPageIndex == 1) return
      this.CurrenetPageIndex--
      this.searchChange();
    },
    godown() {
      this.CurrenetPageIndex++
      this.searchChange();
    },
    gopage() {
      this.searchChange();
    },
    // 初始化视频功能
    async initShipin() {
      try {
        console.log('[视频初始化] 开始初始化视频功能');
        AgoraMiniappSDK.LOG.setLogLevel(-1); // 设置日志级别
        console.log('[Agora SDK] 设置日志级别完成');
        await client.init(this.appid, async () => {
          console.log('[Agora SDK] 初始化成功');
          client.on("stream-added", this.remoteIn); // 监听远程流加入
          client.on("stream-removed", this.remoteOut); // 监听远程流离开
          client.on("error", err => {
            console.error('[Agora SDK] 发生错误:', err);
          });
          console.log('[Agora SDK] 事件监听器已设置');

          await client.setRole("broadcaster"); // 设置角色为广播者
          console.log('[Agora SDK] 角色已设置为广播者');
          await this.joinChannel(); // 加入频道
        }, err => {
          console.error('[Agora SDK] 初始化失败:', err);
        });
      } catch (e) {
        console.error('[视频初始化] 初始化异常:', e);
      }
    },

    // 加入频道
    async joinChannel() {
      try {
        console.log('[频道操作] 开始加入频道');
        if (!this.token) {
          console.log('[Token获取] 开始获取Agora Token');
          let res = await this.$api.base.GetAgoraToken({
            Channel: this.channel,
            Uid: this.uid,
            Id: this.data.Id
          });
          if (res.Success) {
            console.log(res.ResData.appid)
            this.token = res.ResData.token;
            this.appid = res.ResData.appid;
            console.log('[Token获取] Token获取成功', {
              token: this.token,
              appid: this.appid
            });
          } else {
            console.error('[Token获取] 获取Token失败:', res);
          }
        }

        await this.authorize(); // 授权摄像头和麦克风

        await client.join(this.token, this.channel + '', Number(this.uid)); // 加入频道
        console.log('[频道操作] 加入频道成功');
        this.local_stream = await client.publish(); // 发布本地流
        console.log('[流操作] 本地流发布成功');
        return
        try {
          this.recordProcedure = 0
          let rsres = await this.$api.base.RecordStart({
            Channel: this.channel,
            RegistNo: this.data.RegistNo,
            Id: this.data.Id
          })
          if (rsres.Success) {
            this.recordProcedure = 1
            console.error('开始录制成功:', rsres);
          } else {
            throw new Error(rsres.ErrMsg)
          }
        } catch (e) {
          console.error('开始录制失败:', e);
        }
      } catch (e) {
        console.error('[频道操作] 加入频道异常:', e);
      }
    },

    // 离开频道
    async leaveChannel() {
      try {
        console.log('[频道操作] 开始离开频道');
        this.local_stream = null;
        await client.leave(); // 离开频道
        console.log('[频道操作] 离开频道成功');

        if (this.recordProcedure === 1) {
          try {
            let res = await this.$api.base.RecordStop({
              Channel: this.channel,
              Id: this.data.Id
            })
            if (!res.Success)
              throw new Error(res.ErrMsg)
          } catch (e) {
            return console.log('结束录制成功');
          }
          this.recordProcedure = 2
          console.log('结束录制成功');
        } else {
          console.log('录制已结束');
        }

      } catch (e) {
        console.error('[频道操作] 离开频道异常:', e);
      }
    },

    // 处理远程流加入
    async remoteIn(e) {
      console.log('[远程流] 检测到远程流加入', { uid: e.uid }, 'uiduiudiud');
      if (e.uid == 1001) { // 假设患者 UID 为 1001
        this.remote_stream = null;
        console.log('[远程流] 开始订阅患者流');
        client.subscribe(e.uid, (stream) => {
          this.remote_stream = stream;
          console.log('[远程流] 订阅患者流成功');
        }, err => {
          console.error('[远程流] 订阅远程流失败:', err);
        });
      }
    },
    // 处理远程流离开
    async remoteOut(e) {
      console.log('[远程流] 检测到远程流离开', { uid: e.uid });
      if (e.uid == 1001) {
        this.remote_stream = null; // 清除远程流
        console.log('[远程流] 已清除患者流');
      }
    },

    // 授权摄像头和麦克风
    async authorize() {
      try {
        console.log('[权限] 开始请求摄像头授权');
        await new Promise((resolve, reject) => {
          wx.authorize({
            scope: 'scope.camera',
            success: () => {
              console.log('[权限] 摄像头授权成功');
              resolve();
            },
            fail: (err) => {
              console.error('[权限] 摄像头授权失败:', err);
              reject(err);
            },
          });
        });

        console.log('[权限] 开始请求麦克风授权');
        await new Promise((resolve, reject) => {
          wx.authorize({
            scope: 'scope.record',
            success: () => {
              console.log('[权限] 麦克风授权成功');
              resolve();
            },
            fail: (err) => {
              console.error('[sure权限] 麦克风授权失败:', err);
              reject(err);
            },
          });
        });
      } catch (e) {
        console.error('[权限] 授权失败:', e);
      }
    },

    //修改主诉保存
    save() {
      this.sure();
    },
    async InquiryFinish() {
      let ensure = await this.$modal.showModal({
        title: '确认',
        content: '是否确认结束问诊?'
      })
      if (!ensure.confirm)
        return

      let res = await this.$api.order.InquiryFinish({
        Id: this.data.Id
      })
      if (res.Success) {
        //更新当前订单状态
        this.data.Status = res.ResData.Status
        this.$modal.msgSuccess('成功结束当前问诊')
        this.DoctorPass();
      }
      else {
        this.$modal.alert('结束问诊失败')
      }

    },
    //通过并提交
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
    //不通过
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
    getMlist() {
      this.$api.order.OrderRecipe({
        Id: this.data.Id
      }).then(res => {
        console.log(res, 'res')
        if (res.Success) {
          console.log(res, 'resres')
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

    findNameByCode(array, code) {
      const item = array.find(item => item.code === code);
      return item ? item.name : '未知';
    },
    getStatusName(status) {
      const item = this.StatusMap.find(item => item.value === status);
      return item ? item.name : '未知';
    },
    //确定修改
    sure() {
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
    //编辑按钮
    edit(id, index) {
      console.log(this.mList, 'mList')
      console.log(this.$privilege.asUserType('Doctor'))
      console.log(this.data, 'data')
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

  }
};
</script>

<style scoped lang="scss">
.remote_box {
  overflow: hidden;
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 1;
  background-color: transparent;
}

.local_box {
  width: 50%;
  height: calc(100vh - 70vh);
  position: absolute;
  z-index: 2;
  background-color: transparent;
}

.bottomBar {
  display: flex;
  position: absolute;
  bottom: 10rpx;
  z-index: 999;
  width: 100%;

  .endvideo {
    padding: 0 30rpx;
    height: 80rpx;
    background: red;
    border-radius: 15rpx;
    text-align: center;
    color: #fff;
    font-size: 30rpx;
    line-height: 80rpx;
    margin: 0 auto;
  }

  .bottom-btn {
    padding: 0 30rpx;
    height: 80rpx;
    background: red;
    border-radius: 15rpx;
    text-align: center;
    color: #fff;
    font-size: 30rpx;
    line-height: 80rpx;
    margin: 0 auto;
  }
}


.notpass {
  display: inline-block;
  padding: 5rpx 50rpx;
  background: red;
  position: absolute;
  top: 80%;
  right: 5%;
  z-index: 999;
  text-align: center;
  color: #fff;
  font-size: 30rpx;
  line-height: 80rpx;
  margin: 0 auto;
  border-radius: 30rpx;
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

.card-box {
  background: #fff;
  position: fixed;
  bottom: 110rpx;
  left: 0;
  right: 0;
  z-index: 999;

  .infoCard {
    padding: 5rpx 20rpx;

    .infor {
      border-bottom: 1rpx dashed #000;
      padding: 0 0 10rpx;

      .cardinf {
        display: flex;
        justify-content: space-between;

        .left {
          margin-top: 10rpx;
          font-size: 35rpx;

          .item {
            margin: 15rpx 0;
          }
        }

        .right {
          .item {
            display: flex;
            justify-content: flex-end;
            gap: 10rpx;
            margin: 10rpx 0;
            font-size: 35rpx;

            input {
              width: 70%;
              border: 1rpx solid #000;
            }
          }
        }
      }
    }
  }

  scroll-view {

    background: #fff;

    .card-cont {
      height: 380rpx;
      background: #fff;

      .card {
        padding: 20rpx 30rpx;

        .cols {
          display: flex;
          flex-direction: column;

          .bors:last-of-type {
            border-bottom: none;
            margin-bottom: 0;
            padding-bottom: 0;
          }
        }
      }
    }

    .edit {
      color: #E6A23C;
      font-size: 35rpx;

    }

    .del {
      color: red;
      font-size: 35rpx;
      margin-right: 15rpx;
    }

    .methods {
      font-size: 33rpx;
      color: red;
    }

    .font-35 {
      font-weight: bold;
      font-size: 35rpx;
    }

    .font-bold {
      font-size: 35rpx;

    }
  }

  .savebtn {
    display: inline-block;
    padding: 20rpx 30rpx;
    background: #409EFF;
    color: #fff;
    text-align: end;
  }

  .diagnose_box {
    width: 400rpx;
    background: #ffff;
    position: absolute;
    top: 10rpx;
    right: 5rpx;
    z-index: 999;
    border: 1rpx solid #ccc;
    border-radius: 10rpx;

    .item {
      border-top: 1rpx dashed #D8D8DB;
      border-bottom: 1rpx dashed #D8D8DB;
      padding: 3rpx 15rpx;
    }

    .page {
      display: flex;
      justify-content: space-between;
      padding: 3rpx 15rpx;
    }
  }

  .tag {
    display: inline-block;
    background: #007aff;
    color: #fff;
    font-size: 24rpx;
    padding: 5rpx 10rpx;
    margin: 10rpx 10rpx 0 0;

    .iconx {
      position: relative;
      top: -9rpx;
      right: -5rpx;
    }
  }
}
</style>
