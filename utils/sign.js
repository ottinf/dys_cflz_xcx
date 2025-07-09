import w_md5 from "common/md5.js"

// Signature
function parseQueryString(queryString) {
  const params = {};
  // 使用 & 分割查询字符串为键值对数组
  queryString.split("&").forEach((part) => {
    const item = part.split("=");
    const key = decodeURIComponent(item[0]);
    const value = decodeURIComponent(item[1] || '');
    params[key] = value;
  });
  return params;
}
export function sign(config, nonce, timestamp, appSecret) {
  // 签名格式： timestamp + nonce + data(字典升序)+appSecret
  const ret = []
  // const urlParams = new URLSearchParams(config.url.split('?')[1]);
  // 假设 config.url 是你的完整URL
  let urlParams;
  if (config.url.includes('?')) {
    const queryString = config.url.split('?')[1]; // 提取查询字符串部分
    urlParams = parseQueryString(queryString); // 解析查询参数
  } else {
    urlParams = {};
  }
  if (config.params) {
    const pArray = []
    const data = config.params
    for (const it in data) {
      pArray.push(it)
    }
    // 字典升序
    const sArray = pArray.sort()
    for (const it of sArray) {
      let val = data[it]
      if (typeof val === 'object' && //
        (!(val instanceof Array) || (val.length > 0 && (typeof val[0] === 'object')))) {
        val = JSON.stringify(val)
      }
      ret.push(it + val)
    }
  } else if (urlParams.length > 0) {
    const kvlist = urlParams
    for (const [key, value] of kvlist.entries()) {
      ret.push(key + value)
    }
  } else if (config.method !== 'get' && config.method !== 'GET') {
    ret.push(typeof config.data === "string" ? config.data : JSON.stringify(config.data));
  }
  var signsrc = ''
  if (config.header['content-type'].includes('multipart/form-data'))
    signsrc = timestamp + nonce + appSecret
  else
    signsrc = timestamp + nonce + ret.join('') + appSecret

  return w_md5.hex_md5_32(signsrc)
}
/**
 * 获取一个32位随机字符串
 * @returns
 */
export function GetRandomString() {
  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789'
  var maxPos = chars.length
  var pwd = ''
  for (var i = 0; i < 32; i++) {
    pwd += chars.charAt(Math.floor(Math.random() * maxPos))
  }
  return pwd
}