import {
  request
} from '@/utils/request.js';


/**
 * @description  诊断接口
 */
export default {
  /**
   *  @description  获取图形验证码
   */
  Captcha() {
    return request({
      method: "GET",
      url: '/api/Captcha',
    })
  },
  //获取声网视频令牌
  GetAgoraToken(data) {
    return request({
      method: "POST",
      url: `/api/Deyishe/Agora/AgoraGetToken`,
      data,
    })
  },
  RecordStart(data) {
    return request({
      url: '/api/Deyishe/Agora/RecordStart',
      method: 'post',
      data,
    })
  },
  RecordStop(data) {
    return request({
      url: '/api/Deyishe/Agora/RecordStop',
      method: 'post',
      data,
    })
  },
  /**
 *  @description  获取业务统计
 */
  QueryOrderMessage() {
    return request({
      url: '/api/Deyishe/Query/QueryOrderMessage',
      method: 'POST',
    })
  },
  /**
 *  @description  获取业务统计,只有数值
 */
  QueryOrderTotal() {
    return request({
      url: '/api/Deyishe/Query/QueryOrderTotal',
      method: 'POST',
    })
  },
  /**
  *  @description  wx.OnLogin的回调
  */
   AfterToLogin(data) {
     return request({
       url: '/api/WxCall/OnLogin',
       method: 'POST',
       data,
     })
   },
}