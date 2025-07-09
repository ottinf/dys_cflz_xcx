import {
  request
} from '@/utils/request.js';

/**
 * @description  药品接口
 */
export default {
  /**
   * @description  药品分页查询
   */
  SearchMedicine({
    CurrenetPageIndex,
    PageSize,
    pageTotal,
    Keywords,
  }) {
    //let DeptID = uni.getStorageSync('userInfo').DeptId;
    return request({
      method: "POST",
      url: `/api/Deyishe/C_Medict/FindWithPagerWithKey`,
      data: {
        CurrenetPageIndex,
        PageSize,
        pageTotal,
        Keywords,
        //DeptID
      },
    })
  },
  /**
  * @description  查找单个药品对应的诊断 
  */
  FindMedDiag({
    PublicItem,
  }) {
    return request({
      method: "POST",
      url: `/api/Deyishe/C_MedDiag/FindWithCode`,
      data: {
        PublicItem,
      },
    })
  },
  /**
  * @description  查找多个药品对应的诊断 
  */
  FindMedsDiag({
    PublicItems,
  }) {
    return request({
      method: "POST",
      url: `/api/Deyishe/C_MedDiag/FindMedsDiag`,
      data: {
        PublicItems,
      },
    })
  },
}

