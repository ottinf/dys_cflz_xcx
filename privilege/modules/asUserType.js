import store from '@/store'
import dictionary from '@/utils/dictionary'

export default function asUserType(value) {
  let userinfo = uni.getStorageSync('userInfo')
  //是否是对应的类型
  let rightType = value && userinfo != null
  if (rightType) {
    let item = dictionary.get('dic_user_type', 'code', value)
    rightType = item !== null && item.id===userinfo.Type
  }
  return rightType || false
}
