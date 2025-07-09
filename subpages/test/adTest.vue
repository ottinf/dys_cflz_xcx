<template>
  <view>
    <button @click="seeAd()">观看广告</button>
    <view style="width: 100%;height: fit-content;">
      {{adUnitId}}
    </view>
    <view style="width: 100%;height: fit-content;">
      <view v-for="log in logList" :key="log.id" :style="{ color: log.color }">
        [{{ log.time }}] {{ log.text }}
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      adUnitId: '',
      showAdButton:false,
      logList: [], // 日志列表，每个元素为 { id, time, text, color }
      videoAd: null,
      result: {
        isEnded: 0,
      },
      logIdCounter: 0, // 用于生成唯一的日志 ID
    };
  },
  onLoad(options) {
    this.adUnitId = options.adUnitId;
    if (wx.createRewardedVideoAd) {
      this.videoAd = wx.createRewardedVideoAd({
        adUnitId: options.adUnitId,
      });
      this.videoAd.onLoad((e) => {
        this.addLog('已加载', e, '#000000'); // 黑色
        this.showAdButton=true
      });
      this.videoAd.onError((err) => {
        this.addLog('加载失败', err, '#ff0000'); // 红色
      });
      this.videoAd.onClose((res) => {
        this.addLog('关闭视频', res, '#0000ff'); // 蓝色
        this.result.isEnded = res.isEnded ? 1 : -1;
      });
    }
  },
  methods: {
    addLog(text, data=null, color='#000') {
      // 获取当前时间戳，格式为 YYYY-MM-DD HH:mm:ss.sss
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      const milliseconds = String(now.getMilliseconds()).padStart(3, '0');
      const time = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;

      // 生成日志对象
      const log = {
        id: this.logIdCounter++, // 唯一 ID
        time, // 时间戳
        text: text + (data ? `: ${JSON.stringify(data)}` : ''), // 日志内容
        color, // 文本颜色
      };

      // 将日志添加到日志列表
      this.logList.push(log);
    },
    async seeAd() {
      if (!this.videoAd) {
        this.addLog('广告未初始化', null, '#ff0000'); // 红色
        return;
      }

      try {
        // 尝试展示广告
        await this.videoAd.show();
        this.addLog('广告展示成功', null, '#008000'); // 绿色
      } catch (error) {
        this.addLog('广告展示失败，尝试重新加载', null, '#ff0000'); // 红色
        try {
          // 如果展示失败，尝试重新加载广告
          await this.videoAd.load();
          // 加载成功后再次尝试展示
          await this.videoAd.show();
          this.addLog('广告重新加载并展示成功', null, '#008000'); // 绿色
        } catch (err) {
          this.addLog('广告加载或展示失败', err, '#ff0000'); // 红色
          console.error('激励视频广告显示失败', err);
        }
      }
    },
  },
};
</script>

<style>
</style>
