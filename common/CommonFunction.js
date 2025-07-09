class CommonFunction {
  constructor() {
    this.callbacks = {};
  }

  /**
   * 注册回调
   * @param {Object} param0
   * @param {string} param0.name - 回调名称
   * @param {Function} param0.call - 回调函数
   */
  register(name, call) {
    this.callbacks[name] = call;
  }

  /**
   * 判断回调是否存在
   * @param {string} name - 回调名称
   * @returns {boolean} - 是否存在
   */
  exist(name) {
    return typeof this.callbacks[name] === 'function';
  }

  /**
   * 执行回调
   * @param {string} name - 回调名称
   * @param {any} params - 参数
   */
  invoke(name, params) {
    if (!this.exist(name)) {
      console.warn(`回调 "${name}" 未定义或不是函数。`);
      return;
    }
    try {
      return this.callbacks[name](params);
    } catch (error) {
      console.error(`调用回调 "${name}" 时出错：`, error);
    }
  }

  /**
   * 异步执行回调
   * @param {string} name - 回调名称
   * @param {any} params - 参数
   */
  async invokeAsync(name, params) {
    if (!this.exist(name)) {
      console.warn(`回调 "${name}" 未定义或不是函数。`);
      return;
    }
    try {
      return await this.callbacks[name](params);
    } catch (error) {
      console.error(`异步调用回调 "${name}" 时出错：`, error);
    }
  }
}

const _CommonFunction = new CommonFunction();

export default _CommonFunction;
