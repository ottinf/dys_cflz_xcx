import { request } from '@/utils/request.js';
/**
 * @description  签名接口
*/
export default {
  /**
     *  @description  查找待签名订单
     */
  FindSimpleWithPager({
    CurrenetPageIndex,
    PageSize,
    pageTotal,
    Keywords,
  }) {
    return request({
      url: '/api/Deyishe/O_RecipeSign/FindSimpleWithPager',
      method: 'post',
      data:{
        CurrenetPageIndex,
        PageSize,
        pageTotal,
        Keywords,
      },
    })
  },
  /**
     *  @description  进行签名
     */
  DrugPharSign({
    SignType,
    Id,
  }) {
    return request({
      url: '/api/Deyishe/O_RecipeSign/DrugPharSign',
      method: 'post',
      data:{
    SignType,
    Id,
      },
    })
  },
}