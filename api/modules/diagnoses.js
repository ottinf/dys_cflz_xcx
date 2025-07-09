import { request } from '@/utils/request.js';
/**
 * @description  诊断接口
*/
export default {
  /**
     *  @description  疾病编码字典分页查询
     */
  searchDiag({
    CurrenetPageIndex,
    PageSize,
    pageTotal,
    Keywords,
    LB,
  }) {
    return request({
      url: '/api/Deyishe/S_JBBM/FindWithPagerLess',
      method: 'post',
      data:{
        CurrenetPageIndex,
        PageSize,
        pageTotal,
        Keywords,
        LB,
      },
    })
  },
}