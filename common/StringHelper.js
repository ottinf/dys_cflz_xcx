class StringHelper {
  /**
   * 隐藏字符串中指定区间的子串，用指定字符替代。
   * @param {string} str - 待处理的字符串。
   * @param {number} start - 起始索引，包含在隐藏区间。
   * @param {number} end - 结束索引，包含在隐藏区间。
   * @param {string} charc - 替代字符，默认为 '*'
   * @returns {string} 处理后的字符串。
   */
  hideSubString(str, start, end, charc = '*') {
    if (start < 0 || start >= str.length || end < 0 || end >= str.length || start > end) {
      console.error('hideSubString: 输入错误');
      return '';
    }

    const before = str.slice(0, start);
    const hidden = charc.repeat(end - start + 1);
    const after = str.slice(end + 1);
    return before + hidden + after;
  }

  /**
   * 处理输入的数字字符串，根据类型进行相应的处理。
   * @param {string} numberstr - 输入的数字字符串。
   * @param {string} typestr - 处理类型，默认为 '+int'。
   * @returns {string} 处理后的数字字符串。
   */
  handleInputNumber(numberstr, typestr = '+int') {
    if (!numberstr || numberstr == NaN) numberstr = '';
    switch (typestr) {
      case 'float':
        break;
      case '+int':
        numberstr = numberstr.replace(/[^\d]/g, "");
        break;
      case 'phone':
        numberstr = numberstr.replace(/[^\d]/g, "");
        if (numberstr.length > 11) {
          numberstr = numberstr.slice(0, 11);
        }
        break;
      default:
        break;
    }
    return numberstr;
  }

  /**
   * 处理输入的代码字符串，根据类型进行相应的处理。
   * @param {string} str - 输入的代码字符串。
   * @param {string} typestr - 处理类型，默认为 'noblank'。
   * @returns {string} 处理后的代码字符串。
   */
  handleInputCode(str, typestr = 'noblank') {
    if (!str || str == NaN) return '';
    switch (typestr) {
      case 'noblank':
        str = str.replace(/\s/g, '');
        break;
      default:
        break;
    }
    return str;
  }

  /**
   * 判断给定的 userAgent 字符串是否代表移动端设备
   * @param {string} userAgent - 用户代理字符串
   * @returns {boolean} - 如果是移动端设备，则返回 true；否则返回 false
   */
  isMobileDevice(userAgent) {
    let flag = userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i);
    return !!flag;
  }

  /**
   * 判断给定的字符串是否是 11 位数字。
   * @param {string} str - 要检查的字符串。
   * @returns {boolean} 如果字符串是 11 位数字，则返回 true，否则返回 false。
   */
  isPhoneNumber(str) {
    var phoneNumberPattern = /^\d{11}$/;
    return phoneNumberPattern.test(str);
  }

  /**
   * 判断给定的字符串是否为中文名称，汉字数量大于1且小于10。
   * @param {string} str - 要检查的字符串。
   * @returns {boolean} 如果字符串是中文名称且汉字数量大于1且小于10，则返回 true，否则返回 false。
   */
  isChineseName(str) {
    var chineseNamePattern = /^[\u4e00-\u9fa5]{2,9}$/;
    return chineseNamePattern.test(str);
  }

  /**
   * 解析链接的参数
   * @param {string} link - 被解析的链接（可以使重定向链接）
   * @returns {object} 查询参数
   */
  parseLink(link) {
    const decodedLink = decodeURIComponent(link);
    let cleanedLink = decodedLink;
    if (decodedLink.includes('?redirect=')) {
      cleanedLink = decodedLink.split('?redirect=')[1];
    }

    const queryString = cleanedLink.split('?')[1] || '';
    if (!queryString) {
      return {};
    }

    const paramsArray = queryString.split('&');
    const paramsObject = {};
    paramsArray.forEach(param => {
      const keyValue = param.split('=');
      if (keyValue.length === 2) {
        const [key, value] = keyValue;
        paramsObject[key] = value;
      }
    });

    return paramsObject;
  }

  /**
   * 替换转义字符
   * @param {string} url - 要处理的URL
   * @returns {string} 处理后的URL
   */
  replaceEscapedChars(url) {
    const charMap = {
      '\\u0026': '&',
      '\\u003F': '?',
      '\\u003D': '=',
      '\\u002F': '/',
      '\\u003A': ':',
      // 添加任何其他需要替换的字符
    };

    Object.keys(charMap).forEach((escapedChar) => {
      const correctChar = charMap[escapedChar];
      url = url.replace(new RegExp(escapedChar, 'g'), correctChar);
    });

    return url;
  }
}
const stringhelper=new StringHelper();
export default stringhelper;
