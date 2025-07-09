import {
  request
} from '@/utils/request.js';

/**
 * @description  机构接口
 */
export default {
  /**
   * @description  获取机构完整信息
   */
  getOrganizeExtend() {
    return request({
      method: "POST",
      url: `/api/Deyishe/Sys_OrganizeExtend/Get`,
    })
  },
  /**
   * @description  获取机构主要信息
   */
  getOrganize() {
    return request({
      method: "POST",
      url: `/api/Security/Organize/Get`,
    })
  },
  /**
   * @description  获取合作机构
   */
  GetCoopOrgs() {
    return request({
      method: "POST",
      url: `/api/Deyishe/Sys_OrganizeExtend/GetCoopOrgs`,
    })
  }
}