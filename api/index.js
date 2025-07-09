
import base from './modules/base.js'
import diagnoses from './modules/diagnoses.js'
import medicine from './modules/medicine.js'
import order from './modules/order.js'
import organize from './modules/organize.js'
import user from './modules/user.js'
import chat from './modules/chat.js'
import role from './modules/role.js'
import sign from './modules/sign.js'
export default {
  base,//基础接口，验证码等
  diagnoses,//诊断相关接口
  medicine,//药品相关接口
  order,//订单相关接口
  organize,//机构信息接口
  user,//用户相关接口
  chat,//聊天相关接口
  role,//角色接口
  sign,//签名接口
}