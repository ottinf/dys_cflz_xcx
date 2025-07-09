class Utils {

  param2Obj(url) {
    const search = url.split('?')[1]
    if (!search) {
      return {}
    }
    return JSON.parse(
      '{"' +
      decodeURIComponent(search)
      .replace(/"/g, '\\"')
      .replace(/&/g, '","')
      .replace(/=/g, '":"')
      .replace(/\+/g, ' ') +
      '"}'
    )
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 创建一个防抖函数，该函数会在延迟`t`毫秒后执行`fn`，
   * 如果在等待期间再次调用该函数，则重新计时。
   * @param {Function} fn - 需要防抖处理的函数。
   * @param {number} [t=500] - 延迟的毫秒数，默认为500毫秒。
   * @returns {Function} 一个新的防抖函数。
   */
  debounce(fn, t = 500) {
      let timer;
      return function(...args) {
        if (timer) {
          clearTimeout(timer);
        }
        timer = setTimeout(() => {
          timer = null;
          fn.apply(this, args);
        }, t);
      };
    }

    replaceAll(origin, replace, blank = '') {
      if (typeof origin !== 'string') {
        console.error("origin must be a string");
        return origin; // 或者根据需求返回其他值
      }

      if (typeof replace === 'string') {
        // 如果 replace 是字符串，进行简单字符串替换
        return origin.split(replace).join(blank);
      } else if (typeof replace === 'object' && replace !== null) {
        // 如果 replace 是对象，进行键值替换
        let result = origin;
        for (const [key, value] of Object.entries(replace)) {
          if (typeof value !== 'string' && typeof value !== 'number') {
            console.warn(`Value for key '${key}' must be a string or number`);
            continue; // 跳过无效的值
          }
          result = result.split(key).join(String(value));
        }
        return result;
      } else {
        console.error("replace must be a string or an object");
        return origin; // 或者根据需求返回其他值
      }
    }

  getMedia(path, base = "https://api.d1she.cn/") {
    if (!path) return ''
    const absolutePattern = /^(?:[a-z]+:)?\/\//i;
    if (absolutePattern.test(path)) {
      return path;
    }
    // 使用自定义的 replaceAll 方法
    return base + this.replaceAll(path, {
      'wwwroot/': '',
      '//': '/'
    });
  }

}

export default new Utils();