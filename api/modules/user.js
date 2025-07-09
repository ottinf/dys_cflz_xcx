import { request } from '@/utils/request.js';


/**
 * @description  用户接口
*/
export default {

  /**
     *  @description  登录
     * @param {Object} param0 
     * @param {*} param0.Type 1-手机号密码登录，2-token登录，3-手机号验证码登录，4-医保编码登录
     * @param {*} param0.UserCode 1-手机号,2-token,3-手机号,4-医保编码
     * @param {*} param0.PassCode 1-密码,3-获取手机验证码接口返回的PassCode
     * @param {*} param0.ValidCode 1-图形验证码，3-手机验证码,4-图形验证码
     * @param {*} param0.VerifyCode 1-图形验证码返回的key，3-获取手机验证码接口返回的的VerifyCode,4-图形验证码返回的key
     */
  Login({
    Type,
    UserCode,
    PassCode,
    ValidCode,
    VerifyCode
  }) {
    return request({
      method: "POST",
      url: `/api/Login/GetCheckUserByOther`,
      data: {
        Type,
        UserCode,
        PassCode,
        ValidCode,
        VerifyCode,
        AppId: "system", // 应用程序ID（固定字符串）
        SystemCode: "d1she_cflz", // 系统代码（固定字符串）
        Host: "mm.d1she.cn" // 主机（固定字符串）
      },
      encrypt:1
    })
  },
  /**
     *  @description  退出登录
     */
  Logout() {
    return request({
      method: "GET",
      url: `/api/Login/Logout`,
    })
  },
  /**
     *  @description  发送验证码
     */
  GetPhoneCode({
    phone
  }) {
    return request({
      method: "POST",
      url: `/api/Captcha/SendLoginCode?phone=` + phone,
    })
  },
  /**
     *  @description  切换工作状态
     */
  ChangeWorkStatus({
    Status
  }) {
    return request({
      method: "POST",
      url: `/api/Deyishe/S_HosUser/ChangeWorkStatus`,
      data: {
        Status
      }
    })
  },
  /**
   *  @description  获取工作状态
   */
  GetWorkStatus() {
    return request({
      method: "POST",
      url: `/api/Deyishe/S_HosUser/GetWorkStatus`,
    })
  },
  /**
     *  @description  获取用户信息，主要是医务信息
     */
  Get() {
    return request({
      method: "POST",
      url: `/api/Deyishe/S_HosUser/Get`,
    })
  },
  /**
     *  @description  获取用户信息,包含权限和功能菜单和其他token，信息数据最完整
     */
  GetUserInfo() {
    return request({
      method: "GET",
      url: `/api/Login/GetUserInfo`,
    })
  },
  IsBoundWxOpen(){
    return request({
      url: '/api/Security/User/IsBoundWxOpen',
      method: 'post',
    })
  },
  BindWxOpen(data){
    return request({
      url: '/api/Security/User/BindWxOpen',
      method: 'post',
      data,
    })
  },
  UnBindWxOpen(){
    return request({
      url: '/api/Security/User/UnBindWxOpen',
      method: 'post',
    })
  }
}

