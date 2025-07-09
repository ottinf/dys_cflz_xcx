import { request } from '@/utils/request.js';
/**
 * @description  角色接口
*/
export default {
  /**
     *  @description  获取当前用户的角色
     */
  GetSelfRole() {
    return request({
      url: '/api/Security/Role/GetSelfRole',
      method: 'post',
    })
  },
}