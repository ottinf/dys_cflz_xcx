import {
  request
} from '@/utils/request.js';

/**
 * @description  患者和订单接口
 */
export default {

  /**
   * @description 快速推方保存数据
   * @param {{
   *   Id: long,//患者id
   *   Name: string, // 患者姓名
   *   MobilePhone: string, // 患者手机号
   *   IDCard: string, // 患者身份证号
   *   Diagnoses: Array<S_JBBM>, // 诊断信息列表
   *   ChiefComplaint: string, // 主诉
   *   CurrentHistory: string, // 现病史
   *   OldHistory: string, // 既往史
   *   AllergyHistory: string, // 过敏史
   *   Note: string, // 备注
   *   O_RecipeDetailList: Array<O_RecipeDetail> // 处方明细列表
   * }} data - 请求参数
   * @returns {Promise} 请求结果
   */
  PushAllinOne({
    Id = 0,
    Name,
    MobilePhone,
    IDCard,
    Diagnoses,
    ChiefComplaint,
    CurrentHistory,
    OldHistory,
    AllergyHistory,
    Note,
    O_RecipeDetailList,
  }) {
    return request({
      method: "POST",
      url: `/api/Deyishe/O_PatientRegist/PushAllinOne`,
      data: {
        Id,
        Name,
        MobilePhone,
        IDCard,
        Diagnoses,
        ChiefComplaint,
        CurrentHistory,
        OldHistory,
        AllergyHistory,
        Note,
        O_RecipeDetailList,
      },
    });
  },
  /**
   * @description 推送订单
   * @param {{
   *   Id: long,//患者id
   *   PatSysType: number, // 患者系统类型,1图文问诊,2视频问诊
   *   Med_type: number, // 医保类型,0非医保,140104门诊慢病处方,140201门诊特病处方
   *   MobilePhone: string, // 患者手机号
   *   AllergyHistory: string, // 过敏史
   *   ChiefComplaint: string, // 主诉
   *   CurrentHistory: string, // 现病史
   *   OldHistory: string, // 既往史
   *   Note: string, // 备注
   *   Diagnoses: Array<S_JBBM>, // 诊断信息列表
   *   O_RecipeDetailList: Array<O_RecipeDetail> // 处方明细列表
   * }} data - 请求参数
   * @returns {Promise} 请求结果
   */
  PushOrder({
    Id = 0,
    PatSysType,
    Med_type,
    MobilePhone,
    AllergyHistory,
    ChiefComplaint,
    CurrentHistory,
    OldHistory,
    Note,
    Diagnoses,
    O_RecipeDetailList,
  }) {
    return request({
      method: "POST",
      url: `/api/Deyishe/O_PatientRegist/SaveMedicalInfo`,
      data: {
        Id,
        PatSysType,
        Med_type,
        MobilePhone,
        AllergyHistory,
        ChiefComplaint,
        CurrentHistory,
        OldHistory,
        Note,
        Diagnoses,
        O_RecipeDetailList,
      },
    });
  },
  /**
   * @description  订单分页查询
   */
  FindOrderWithPager({
    CurrenetPageIndex,
    PageSize,
    pageTotal,
    Keywords,
    Status,
    StatusQueryType,
    StartDate,
    EndDate,
    SignFlag
  }) {
    return request({
      method: "POST",
      url: `/api/Deyishe/O_PatientRegist/FindWithPagerListAsync`,
      data: {
        CurrenetPageIndex,
        PageSize,
        pageTotal,
        Keywords,
        Status,
        StatusQueryType,
        StartDate,
        EndDate,
        SignFlag
      },
    })
  },

  FindWaitingPatientPager(data){
    return request({
      url: '/api/Deyishe/O_PatientRegist/FindSimpleWithPager',
      method: 'post',
      data,
    })
  },

  DoctorJoined(data) {
    return request({
      url: '/api/Deyishe/O_PatientRegist/DoctorJoined',
      method: 'post',
      data,
    })
  },
  InquiryFinish(data) {
    return request({
      url: '/api/Deyishe/O_PatientRegist/InquiryFinish',
      method: 'post',
      data,
    })
  },
  DoctorPass(data) {
    return request({
      url: '/api/Deyishe/O_PatientRegist/DoctorPass',
      method: 'post',
      data,
    })
  },
  DoctorNoPass(data) {
    return request({
      url: '/api/Deyishe/O_PatientRegist/DoctorNoPass',
      method: 'post',
      data,
    })
  },
  /**
   * @description  医生获取视频待问诊列表
   */
  GetVideoQuery() {
    return request({
      method: "POST",
      url: `/api/Deyishe/O_PatientRegist/GetVideoQuery`,
    })
  },
  /**
   * @description  订单详细数据
   */
  OrderDetail({
    Id
  }) {
    return request({
      method: "POST",
      url: `/api/Deyishe/O_PatientRegist/Get`,
      data: {
        Id,
      }
    })
  },
  /**
   * @description  处方下载
   */
  RecipeDownload({
    Id
  }) {
    return request({
      method: "GET",
      url: `/api/Deyishe/O_RecipeDetail/GetRecipeImage`,
      data: {
        Id,
      }
    })
  },
  /**
   * @description  获取订单的处方数据
   */
  OrderRecipe({
    Id
  }) {
    return request({
      method: "POST",
      url: `/api/Deyishe/O_RecipeDetail/GetList`,
      data: {
        Id,
      }
    })
  },
  /**
   * @description  获取订单的二维码以供患者扫码
   */
  GetMedicalQRCode({
    Id
  }) {
    return request({
      method: "POST",
      url: `/api/Deyishe/O_PatientRegist/GetMedicalQRCode`,
      data: {
        Id,
      }
    })
  },
  //问诊时保存
  SaveWhenInquiry(data) {
    return request({
      method: "POST",
      url: `/api/Deyishe/O_PatientRegist/SaveWhenInquiry`,
      data,
    })
  }

}