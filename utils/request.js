import settings from '@/settings.js'

import CryptoHelper from './crypt'

import {
  GetRandomString,
  sign
} from '@/utils/sign.js'

export const baseUrl = {
  baseUrl: settings.url
}
// 防抖函数
function debounce(fn, delay) {
  let timer = null;
  return function() {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.apply(this, arguments);
    }, delay);
  };
}

export const request = (config) => {
  let token = uni.getStorageSync('token') || ''
  config.header = config.header || {};
  config.header['Authorization'] = 'Bearer ' + token;
  config.data = config.data || {};

  // 如果没有设置 Content-Type，则默认设置为 application/json
  if (config.header['Content-Type'] === undefined) {
    config.header['Content-Type'] = 'application/json;charset=UTF-8';
  }

  if (Object.prototype.toString.call(config.data) === '[object FormData]') {
    config.header['Content-Type'] = 'multipart/form-data';
  }
  
  if (config.encrypt) {
    config.header['encrypt'] = 1;
    let body = config.data
    let endata = CryptoHelper.encrypt(config.data)
    let dedata = CryptoHelper.de(endata)
    config.data = endata
  }

  config.header['content-type'] = config.header['content-type'] || 'application/json';

  let k = GetRandomString()

  let timestamp = new Date().getTime().toString().substring(0, 10)
  let appkey = settings.appSecret
  let uu = sign(config, k, timestamp, appkey)
  config.header['Timestamp'] = timestamp
  config.header['nonce'] = k
  config.header['appId'] = settings.appId
  config.header['Signature'] = uu
  config.url = baseUrl.baseUrl + config.url
  let promise = new Promise(function(resolve, reject) {
    uni.request(config).then(responses => {

      if (responses.statusCode != 200) {
        reject({
          message: responses.errMsg
        })
      } else {
        let res = responses.data

        if (config.encrypt) {
          let deres = CryptoHelper.decrypt(res)
          res = deres
          console.log(res)
        }
        if (!res.Success) {
          if (res.ErrCode == '40008') {
            setTimeout(() => {
              uni.reLaunch({
                url: '/pages/login/login'
              })
            }, 10)

          }
          if (res.ErrCode == '40004' && res.ResData == 'token校验失败') {
            setTimeout(() => {
              uni.reLaunch({
                url: '/pages/login/login'
              })
            }, 10)
          }
          if (res.ErrCode == '40000') {
            uni.reLaunch({
              url: '/pages/login/login'
            })
          } else {

          }
        }
        resolve(res)

      }
    }).catch(error => {
      console.log('request.js error ' + config.url, error);
      reject(error)
    })
  })

  return promise
}