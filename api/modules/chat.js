import {
  request
} from '@/utils/request.js';

/**
 * @description  聊天接口
 */
export default {
  /**
   * @description  获取当前医生与某个患者的消息记录
   */
  DoctorGetMessage({
    Id
  }) {
    return request({
      method: "POST",
      url: `/api/Deyishe/O_ChatHead/DoctorGetMessage`,
      data: {
        Id,
      }
    })
  },
  /**
   * @description  医生向患者发消息
   */
  DoctorSendMessage({
    Id,
    Text,
    Type = 0,
  }) {
    return request({
      method: "POST",
      url: `/api/Deyishe/O_ChatHead/DoctorSendMessage`,
      data: {
        Id,
        Text,
        Type,
      }
    })
  },
  /**
   * @description  已读信息
   */
  DoctorReadMessage({
    Id
  }) {
    return request({
      method: "POST",
      url: `/api/Deyishe/O_ChatHead/DoctorReadMessage`,
      data: {
        Id,
      }
    })
  },
  /**
 * @description 药店生成自动问诊的记录
 * @param {Object} param0 
 * @param {string} param0.Id 订单ID
 * @param {Array<{ SenderID: string, Text: string }>} param0.Chats 
 *    发送的聊天记录数组，每个聊天记录包含：
 *    @param {string} SenderID 发送方的ID（可以是 Id 或 DoctorID）
 *    @param {string} Text 聊天文本内容
 */
  DrugAddMessage({
    Id,
    Chats
  }) {
    return request({
      method: "POST",
      url: `/api/Deyishe/O_ChatHead/DrugAddMessage`,
      data: {
        Id,
        Chats
      }
    })
  },
}