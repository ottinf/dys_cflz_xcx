class IDCard {
  constructor() {
  }

  /**
   * 验证身份证号码的有效性。
   * @returns {boolean} 是否是有效的身份证号码。
   */
  isValid(cardstr) {
    const reg = /^\d{17}([0-9]|X)$/;
    return reg.test(cardstr);
  }

  /**
   * 获取出生日期。
   * @returns {string} 出生日期，格式为 YYYY-MM-DD。
   */
  getBirthDate(cardstr) {
    if (!this.isValid(cardstr)) return '';
    return `${cardstr.substring(6, 10)}-${cardstr.substring(10, 12)}-${cardstr.substring(12, 14)}`;
  }

  /**
   * 获取性别。
   * @returns {string} 性别，'男' 或 '女'。
   */
  getGender(cardstr) {
    if (!this.isValid(cardstr)) return '';
    return parseInt(cardstr.substring(16, 17)) % 2 ? '男' : '女';
  }

  /**
   * 获取年龄。
   * @returns {number} 年龄。
   */
  getAge(cardstr) {
    if (!this.isValid(cardstr)) return 0;
    const currentYear = new Date().getFullYear();
    return currentYear - parseInt(cardstr.substring(6, 10));
  }
}
const IDCardUtil=new IDCard()
// 导出 IDCard 类的实例
export default IDCardUtil;
