import asUserType from "./modules/asUserType.js"
import hasPermi from './modules/hasPermi.js'
import hasRole from './modules/hasRole.js'
class Permission {

  //******************************************************************************************************
  //  对外提供的方法
  //******************************************************************************************************

  

  //******************************************************************************************************
  //  对内方法
  //******************************************************************************************************

  constructor(arg) {
    this.init()
  }

  init() {
    this.asUserType=asUserType
    this.hasPermi=hasPermi
    this.hasRole=hasRole
  }
}

export default new Permission()
