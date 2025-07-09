import settings from "../settings";

/**
 * 消息队列项类，用于跟踪每个消息的状态。
 */
class MsgQueueItem {
  constructor(id, data, call) {
    this.id = id; // 消息的唯一标识符
    this.data = data; // 消息内容
    this.time = new Date(); // 消息创建的时间戳
    this.call = call; // 消息发送后的回调函数
    this.status = 0; // 消息状态：0=未发送, 1=已发送, 2=已回复, -1=失败
  }
}

export default class DocChatSocket {

  //******************************************************************************************************
  //  构造函数和初始化
  //******************************************************************************************************

  /**
   * 构造函数，接受选项以设置回调并初始化。
   * @param {Object} option - 包含事件回调的选项对象。
   */
  constructor(option) {
    this.init(option);
    this.startTask();
  }

  /**
   * 初始化方法，设置初始状态和事件处理器。
   */
  init(option) {

    this.wsconnect = null; // WebSocket连接对象
    this.idCounter = 0; // 用于生成唯一消息ID的计数器
    this.pingCounter = 0; // 用于心跳和重连尝试的计数器
    this.reconnectInterval = 10; // 重连尝试的计数器间隔值（对应5秒）
    this.eventHandlers = {}; // 存储事件处理函数的对象
    this.msgQueue = []; // 消息队列，用于存储待发送的消息

    this.eventHandlers['default'] = (data) => {};

  }

  //******************************************************************************************************
  //  连接和任务管理
  //******************************************************************************************************

  /**
   * 启动定时任务，负责心跳发送和消息队列处理。
   */
  startTask() {
    this.timer = setInterval(async () => {
      if (!this.token) {
        let sockettoken = uni.getStorageSync('SocketToken');
        if (sockettoken && sockettoken.chat)
          this.token = sockettoken.chat
        else {
          let userinfo = uni.getStorageSync('userInfo');
          if (userinfo && userinfo.SocketToken && userinfo.SocketToken.chat)
            this.token = userinfo.SocketToken.chat
        }
        if (!this.token)
          return;
      }
      if (!this.url) {
        let baseurl = settings.url
        if (baseurl == 'https://api.d1she.cn') {
          this.url = `wss://api2.d1she.cn/socket/chat?token=${this.token}`
        } else {
          baseurl = baseurl.replace('http', 'ws')
          this.url = `${baseurl}/socket/chat?token=${this.token}`
        }
        return;
      }
      if (!this.is_connect()) {
        if (this.reconnectInterval == 0) {
          this.reconnectInterval--;
          this.connect();
        } else if (this.reconnectInterval > 0) {
          this.reconnectInterval--;
        } else {
          this.reconnectInterval=10;
        }
        return;
      }

      // 发送心跳
      this.pingCounter += 1;
      //服务器60秒清除一次客户端，所以需要每59秒ping一次
      if (this.pingCounter > 590) {
        this.pingCounter = 0;
        this.wsconnect.send({
          data: '{"type":"ping"}'
        });
        this.clearQueue();
      }

      // 发送消息，一个时间间隔只处理一次
      this.sendQueuedMessages();

    }, 100);
  }

  /**
   * 建立WebSocket连接。
   */
  connect() {
    if (this.check() < 3) {
      console.log(new Date(), this.wsconnect.readyState, '不重连');
      return;
    }
    this.wsconnect = uni.connectSocket({
      url: this.url,
      complete: (e) => {
        console.log('连接Socket完成', e)
      }
    });
    this.wsconnect.onopen = this.onOpen.bind(this);
    this.wsconnect.onerror = this.onError.bind(this);
    this.wsconnect.onmessage = this.onMessage.bind(this);
    this.wsconnect.onclose = this.onClose.bind(this);
  }

  //******************************************************************************************************
  //  回调和事件处理
  //******************************************************************************************************

  /**
   * WebSocket连接打开的事件处理。
   */
  onOpen() {
    console.log('聊天通道连接成功')
    this.reconnectInterval = 50;
  }

  /**
   * WebSocket收到消息的事件处理。
   * @param {MessageEvent} event - 收到的消息事件。
   */
  onMessage(event) {
    const pack = JSON.parse(event.data);
    const handler = this.eventHandlers[pack.Type] || this.eventHandlers['default'];
    handler(pack);
  }

  /**
   * WebSocket关闭的事件处理。
   * @param {CloseEvent} e - 关闭事件。
   */
  onClose(e) {
    this.reconnectInterval = 50;
    this.timer && clearInterval(this.timer);
  }

  /**
   * WebSocket错误的事件处理。
   * @param {ErrorEvent} e - 错误事件。
   */
  onError(e) {
    console.log('onError', e);
    this.reconnectInterval = 50;
  }

  /**
   * 注册事件处理器。
   * @param {string} event - 事件名称。
   * @param {Function} callback - 事件处理函数。
   */
  handle(event, callback) {
    if (typeof callback === 'function') {
      this.eventHandlers[event] = callback;
    }
  }

  //******************************************************************************************************
  //  消息队列控制
  //******************************************************************************************************

  /**
   * 清除已发送的队列消息。
   */
  clearQueue() {
    // 只保留未发送的消息
    this.msgQueue = this.msgQueue.filter(item => item.status === 0);
  }

  /**
   * 发送队列中的消息。
   */
  sendQueuedMessages() {
    if (this.msgQueue.length == 0) return;
    const item = this.msgQueue[0];
    if (item.status !== 0) {
      this.msgQueue.splice(0, 1)
      return
    }
    try {
      this.wsconnect.send({
        data: JSON.stringify(item.data)
      });
      item.status = 1; // 标记为已发送
    } catch (e) {
      console.log('发送失败:', e);
      item.status = -1; // 标记为失败
    }
  }

  /**
   * 发送消息，外部调用。
   * @param {Object} data - 发送的消息数据。
   * @param {boolean} first - 是否优先发送。
   * @param {function} call - 消息回调。
   * @returns {Promise<MsgQueueItem>} - 返回一个 Promise，成功后返回消息队列项。
   */
  async send(data, first = false, call = null) {
    const id = this.getMsgId();
    const item = new MsgQueueItem(id, data, call);

    // 将消息加入队列
    if (first) {
      this.msgQueue.unshift(item);
    } else {
      this.msgQueue.push(item);
    }

    // 等待消息发送成功
    let waitTime = 100; // 初始等待时间为 100ms
    while (true) {
      await delay(waitTime); // 等待指定时间

      if (item.status === 1) { // 已发送
        if (item.call && typeof item.call === 'function') {
          item.call(); // 调用回调函数
        }
        return item; // 返回消息队列项
      } else if (item.status === -1) { // 发送失败
        throw new Error('消息发送失败');
      }

      // 等待时间翻倍
      waitTime *= 2;

      // 如果等待时间超过 1 分钟（60000ms），抛出异常
      if (waitTime > 60000) {
        throw new Error('消息发送超时');
      }
    }
  }

  //******************************************************************************************************
  //  辅助方法
  //******************************************************************************************************

  /**
   * 获取消息ID，用于标识每个消息。
   * @returns {number} - 返回一个唯一的消息ID。
   */
  getMsgId() {
    this.idCounter = (this.idCounter + 1) % 99999999;
    return this.idCounter;
  }

  /**
   * 检查当前WebSocket连接状态。
   * @returns {boolean} - 返回连接是否处于打开状态。
   */
  is_connect() {
    return this.wsconnect && this.wsconnect.readyState === 1;
  }

  /**
   * 检查WebSocket当前状态。
   * @returns {number} - 返回当前WebSocket的readyState。
   */
  check() {
    return this.wsconnect ? this.wsconnect.readyState : 3;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  };
}