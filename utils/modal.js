class MessageUtil {
  constructor() {
    this.innerAudioContext = null;
    this.playTimer = null;
    this.loadingTimer = null;
    this.eventHandler = {};
    uni.onPushMessage((res) => this.handlePushMessage(res.data.payload))
  }

  // 通用的 showToast 方法
  showToast(content, icon, options = {}) {
    const toastOptions = {
      title: content,
      icon: icon,
      duration: options.duration || 2000
    };

    ['success', 'fail', 'complete'].forEach(callback => {
      if (options[callback]) {
        toastOptions[callback] = options[callback];
      }
    });

    uni.showToast(toastOptions);
  }
  // 显示模态对话框
  showModal(options) {
    return new Promise((resolve, reject) => {
      uni.showModal({
        title: options.title || '提示',
        content: options.content || '',
        showCancel: options.showCancel !== false,
        cancelText: options.cancelText || '取消',
        cancelColor: options.cancelColor || '#000000',
        confirmText: options.confirmText || '确定',
        confirmColor: options.confirmColor || '#007aff',
        editable: options.editable || false,
        placeholderText: options.placeholderText || '',
        success: (res) => {
          if (res.confirm) {
            resolve({
              confirm: true,
              cancel: false,
              content: res.content // 如果 editable 为 true，这里会包含用户输入的内容
            });
          } else if (res.cancel) {
            resolve({
              confirm: false,
              cancel: true
            });
          }
        },
        fail: (err) => {
          reject(err);
        }
      });
    });
  }


  // 消息提示
  msg(content, options = {}) {
    this.showToast(content, 'none', options);
  }

  // 错误消息
  msgError(content, options = {}) {
    this.showToast(content, 'error', options);
  }

  // 成功消息
  msgSuccess(content, options = {}) {
    this.showToast(content, 'success', options);
  }

  // 警告消息
  msgWarning(content, options = {}) {
    this.showToast(content, 'none', options);
  }

  // 显示确认对话框
  confirm(content, title = '确认') {
    return this.showModal({
      title: title,
      content: content,
      showCancel: true
    });
  }

  // 显示提示对话框
  alert(content, title = '提示') {
    return this.showModal({
      title: title,
      content: content,
      showCancel: false
    });
  }

  // 显示输入对话框
  prompt(content, title = '请输入', placeholder = '') {
    return this.showModal({
      title: title,
      content: content,
      editable: true,
      placeholderText: placeholder
    });
  }

  // 打开加载提示
  async loading(content,path) {
    uni.showLoading({
      title: content,
      mask: true
    });
    if(path){
      await new Promise(resolve => setTimeout(resolve, 2000));
      uni.hideLoading();
      uni.redirectTo({
        url:path
      })
    }
  }

  // 打开加载提示并返回首页
  loadingHome(content) {
    uni.showLoading({
      title: content,
      mask: true
    });

    this.loadingTimer = setTimeout(() => {
      uni.hideLoading();
      uni.reLaunch({
        url: '/index/index'
      });
    }, 3000);
  }

  // 打开加载提示并返回首页
  async loadingQuit(content) {
    uni.showLoading({
      title: content,
      mask: true
    });

    // 将 setTimeout 包装在 Promise 中
    await new Promise(resolve => setTimeout(resolve, 3000));

    // 退出应用逻辑
    // #ifdef APP-PLUS
    plus.runtime.quit();
    // #endif

    // #ifdef MP
    uni.switchTab({
      url: '/pages/index/index'
    });
    // #endif

    // #ifdef H5
    if (navigator.userAgent.indexOf('Mobile') > -1) {
      window.history.back();
    } else {
      window.close();
    }
    // #endif
  }

  // 关闭加载提示
  closeLoading() {
    if (this.loadingTimer) {
      clearTimeout(this.loadingTimer);
      this.loadingTimer = null;
    }
    uni.hideLoading();
  }


  async sendNotice({
    title,
    content,
    icon = '/static/logo.png',
    sound = 'system',
    data = '',
    type = 'default',
    callback = () => {}
  }) {
    try {
      // #ifdef APP-PLUS

      uni.createPushMessage({
        content: content,
        title: title,
        icon: icon,
        sound: sound,
        delay: 0.01,
        payload: {
          push_message_type: type,
          ...data,
        }
      });

      this.eventHandler[type] = async (payload) => {
        await callback(payload);
      };

      // #endif

      // #ifdef H5
      if ('Notification' in window) {
        if (Notification.permission === 'granted') {
          const notification = new Notification(title, {
            body: content,
            icon: icon
          });
          notification.onclick = () => callback({
            type,
            data
          });
        } else if (Notification.permission !== 'denied') {
          try {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
              const notification = new Notification(title, {
                body: content,
                icon: icon
              });
              notification.onclick = () => callback({
                type,
                data
              });
            }
          } catch (error) {
            console.error('Error requesting notification permission:', error);
          }
        }
      } else {
        console.log('This browser does not support desktop notification');
        alert(`${title}: ${content}`);
        callback({
          type,
          data
        });
      }
      // #endif
    } catch (error) {
      console.error('Error sending notice:', error);
    }
  }


  async playSound(src, delay = 10) {
    let self = this;

    // 停止并销毁之前的音频上下文（如果存在）
    if (self.innerAudioContext) {
      self.innerAudioContext.stop();
      self.innerAudioContext.destroy();
      self.innerAudioContext = null;
    }

    // 创建新的音频上下文
    self.innerAudioContext = uni.createInnerAudioContext();
    self.innerAudioContext.autoplay = true;
    self.innerAudioContext.src = src;

    // 监听播放开始事件
    self.innerAudioContext.onPlay(() => {
      //console.log('Audio is playing');
    });

    // 监听错误事件
    self.innerAudioContext.onError((res) => {
      console.error('Audio play error:', res.errMsg);
    });

    // 开始播放
    self.innerAudioContext.play();
  }

  async handlePushMessage(payload) {
    if (payload && payload.push_message_type && this.eventHandler[payload.push_message_type]) {
      try {
        await this.eventHandler[payload.push_message_type](payload)
      } catch (error) {
        console.error(`Error handling ${payload.push_message_type} event:`, error);
      }
    }
  }



}




export default new MessageUtil();